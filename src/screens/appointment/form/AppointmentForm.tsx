import WeekStrip from "@/screens/appointment/components/WeekStrip";
import TextInput from "@/components/TextInput";

import { useSemanticColors } from "@/hooks/useSemanticColors";
import { getSlotsByDentistAndDate } from "@/api/services/appointment";
import { getDentistByClinic } from "@/api/services/dentist";
import { AppointmentSlot, CreateAppointment } from "@/types/appointment";
import { Dentist } from "@/types/dentist";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { formatPromotionDate, formatPromotionDiscount, getClinicDateKeyFromIso, isSlotInsidePromotion } from "../lib/appointmentHelpers";

import { getPatientHome } from "@/api/services/home_patient";

import { PatientHomePromotion } from "@/types/home";

/* ========================================================================== */
/*                                  SCHEMA                                    */
/* ========================================================================== */

const appointmentSchema = z.object({
  dentistId: z
    .number({
      required_error: "Selecciona un odontólogo",

      invalid_type_error: "Selecciona un odontólogo",
    })
    .min(1, "Selecciona un odontólogo"),

  date: z.string().min(1, "Selecciona una fecha"),

  slotStartDatetime: z.string().min(1, "Selecciona un horario"),

  reason: z.string().trim().min(3, "Describe brevemente el motivo de tu cita").max(250, "El motivo no puede superar los 250 caracteres"),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

/* ========================================================================== */
/*                                   TYPES                                    */
/* ========================================================================== */

type Props = {
  clinicId: number;
  patientId: number;
  onSubmit?: (data: CreateAppointment) => void | Promise<void>;
  promotionId?: number | null;
};

type ThemeColors = ReturnType<typeof useSemanticColors>;

/* ========================================================================== */
/*                                  HELPERS                                   */
/* ========================================================================== */

const dateToLocalKey = (date: Date): string => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const dateKeyToDate = (value: string): Date => {
  return new Date(`${value}T12:00:00`);
};

const formatSelectedDate = (value: string): string => {
  if (!value) {
    return "";
  }

  const date = dateKeyToDate(value);

  const result = date.toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return result.charAt(0).toUpperCase() + result.slice(1);
};

const getHHMMHour = (hhmm: string): number => {
  return Number(hhmm.split(":")[0]);
};

const getDentistFullName = (dentist: Dentist): string => {
  return [dentist.name, dentist.lastName]
    .filter(Boolean)
    .map((value) => String(value).trim())
    .join(" ");
};

const getDentistPrimarySpeciality = (dentist: Dentist): string => {
  const specialities = (dentist as any).specialities;

  if (!Array.isArray(specialities) || specialities.length === 0) {
    return "Odontología general";
  }

  const first = specialities[0];

  const name = first?.name ?? first?.speciality ?? first?.specialityName ?? first?.title ?? null;

  return name ? String(name).trim() : "Odontología general";
};

/* ========================================================================== */
/*                             FORM APPOINTMENT                               */
/* ========================================================================== */

export default function FormAppointment({ clinicId, patientId, promotionId, onSubmit }: Props) {
  const c = useSemanticColors();

  const normalizedPromotionId = useMemo(() => {
    if (promotionId === null || promotionId === undefined) {
      return null;
    }

    const parsed = Number(promotionId);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }, [promotionId]);

  const hasPromotion = normalizedPromotionId !== null;

  /* ----------------------------------------------------------------------- */
  /* FORM                                                                    */
  /* ----------------------------------------------------------------------- */

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,

    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      dentistId: 0,
      date: "",
      slotStartDatetime: "",
      reason: "",
    },
  });

  const watchDentistId = watch("dentistId");

  const watchDate = watch("date");

  const watchSlotStartDatetime = watch("slotStartDatetime");

  const watchReason = watch("reason");

  /* ----------------------------------------------------------------------- */
  /* STATE                                                                   */
  /* ----------------------------------------------------------------------- */

  const [dentists, setDentists] = useState<Dentist[]>([]);

  const [loadingDentists, setLoadingDentists] = useState(false);

  const [dentistsError, setDentistsError] = useState<string | null>(null);

  const [slots, setSlots] = useState<AppointmentSlot[]>([]);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [slotsError, setSlotsError] = useState<string | null>(null);

  /* ----------------------------------------------------------------------- */
  /* PROMOTION                                                               */
  /* ----------------------------------------------------------------------- */

  const [promotion, setPromotion] = useState<PatientHomePromotion | null>(null);

  const [loadingPromotion, setLoadingPromotion] = useState(false);

  const [promotionError, setPromotionError] = useState<string | null>(null);

  /* ----------------------------------------------------------------------- */
  /* DERIVED                                                                 */
  /* ----------------------------------------------------------------------- */

  const promotionStartDateKey = useMemo(() => {
    if (!promotion) {
      return null;
    }

    return getClinicDateKeyFromIso(promotion.startDate) || null;
  }, [promotion]);

  const promotionEndDateKey = useMemo(() => {
    if (!promotion) {
      return null;
    }

    return getClinicDateKeyFromIso(promotion.endDate) || null;
  }, [promotion]);

  const promotionMinDate = useMemo(() => {
    if (!promotionStartDateKey) {
      return null;
    }

    return dateKeyToDate(promotionStartDateKey);
  }, [promotionStartDateKey]);

  const promotionMaxDate = useMemo(() => {
    if (!promotionEndDateKey) {
      return null;
    }

    return dateKeyToDate(promotionEndDateKey);
  }, [promotionEndDateKey]);

  const selectedDentist = useMemo(() => {
    return dentists.find((dentist) => dentist.id === watchDentistId) ?? null;
  }, [dentists, watchDentistId]);

  const selectedSlot = useMemo(() => {
    return slots.find((slot) => slot.startDatetime === watchSlotStartDatetime) ?? null;
  }, [slots, watchSlotStartDatetime]);

  /**
   * Para un paciente no tiene mucho sentido
   * mostrar horarios ocupados.
   *
   * Solo mostramos horarios seleccionables.
   */
  const availableSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (slot.isBusy) {
        return false;
      }

      if (promotion && !isSlotInsidePromotion(slot, promotion)) {
        return false;
      }

      return true;
    });
  }, [slots, promotion]);
  const morningSlots = useMemo(() => {
    return availableSlots.filter((slot) => getHHMMHour(slot.startHHMM) < 12);
  }, [availableSlots]);

  const afternoonSlots = useMemo(() => {
    return availableSlots.filter((slot) => getHHMMHour(slot.startHHMM) >= 12);
  }, [availableSlots]);

  const promotionReady = !hasPromotion || (!loadingPromotion && !promotionError && promotion !== null);

  const formReady = Boolean(watchDentistId && watchDate && watchSlotStartDatetime && watchReason?.trim().length >= 3 && promotionReady);

  /* ====================================================================== */
  /* LOAD DENTISTS                                                          */
  /* ====================================================================== */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingDentists(true);

        setDentistsError(null);

        const data = await getDentistByClinic(clinicId);

        if (!mounted) {
          return;
        }

        setDentists(Array.isArray(data) ? data.filter((dentist: any) => dentist.state === "1") : []);
      } catch (error) {
        console.error("Error cargando odontólogos:", error);

        if (mounted) {
          setDentists([]);

          setDentistsError("No se pudieron cargar los odontólogos.");
        }
      } finally {
        if (mounted) {
          setLoadingDentists(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [clinicId]);

  /* ====================================================================== */
  /* LOAD PROMOTION                                                        */
  /* ====================================================================== */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      /* ------------------------------------------------------------------ */
      /* NORMAL APPOINTMENT                                                 */
      /* ------------------------------------------------------------------ */

      if (!normalizedPromotionId) {
        setPromotion(null);

        setPromotionError(null);

        setLoadingPromotion(false);

        return;
      }

      try {
        setLoadingPromotion(true);

        setPromotionError(null);

        /*
         * Por ahora reutilizamos el Home.
         *
         * El backend devuelve promociones
         * vigentes para la clínica actual.
         *
         * Más adelante podemos reemplazarlo
         * por getPromotionById().
         */
        const home = await getPatientHome();

        if (!mounted) {
          return;
        }

        const found = (home.promotions ?? []).find((item) => item.id === normalizedPromotionId);

        if (!found) {
          setPromotion(null);

          setPromotionError("La promoción ya no se encuentra disponible.");

          return;
        }

        setPromotion(found);
      } catch (error) {
        console.error("Error cargando promoción:", error);

        if (mounted) {
          setPromotion(null);

          setPromotionError("No se pudo verificar la promoción seleccionada.");
        }
      } finally {
        if (mounted) {
          setLoadingPromotion(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [normalizedPromotionId]);

  /* ====================================================================== */
  /* LOAD SLOTS                                                             */
  /* ====================================================================== */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!watchDentistId || !watchDate) {
        setSlots([]);

        setValue("slotStartDatetime", "");

        return;
      }

      try {
        setLoadingSlots(true);

        setSlotsError(null);

        setValue("slotStartDatetime", "");

        clearErrors("slotStartDatetime");

        const data = await getSlotsByDentistAndDate(watchDentistId, watchDate);

        if (!mounted) {
          return;
        }

        setSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando horarios:", error);

        if (mounted) {
          setSlots([]);

          setSlotsError("No se pudieron consultar los horarios disponibles.");
        }
      } finally {
        if (mounted) {
          setLoadingSlots(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [watchDentistId, watchDate, setValue, clearErrors]);

  /* ====================================================================== */
  /* RESET INVALID PROMOTION DATE                                          */
  /* ====================================================================== */

  useEffect(() => {
    if (!promotion || !watchDate || !promotionStartDateKey || !promotionEndDateKey) {
      return;
    }

    if (watchDate < promotionStartDateKey || watchDate > promotionEndDateKey) {
      setValue("date", "");

      setValue("slotStartDatetime", "");

      setSlots([]);
    }
  }, [promotion, watchDate, promotionStartDateKey, promotionEndDateKey, setValue]);

  /* ====================================================================== */
  /* SELECT DENTIST                                                         */
  /* ====================================================================== */

  const handleSelectDentist = (dentistId: number, onChange: (value: number) => void) => {
    onChange(dentistId);

    /**
     * Si cambia el odontólogo,
     * el horario seleccionado ya no es válido.
     */
    setValue("slotStartDatetime", "");

    clearErrors("dentistId");

    clearErrors("slotStartDatetime");
  };

  /* ====================================================================== */
  /* SELECT DATE                                                            */
  /* ====================================================================== */

  const handleSelectDate = (date: Date, onChange: (value: string) => void) => {
    onChange(dateToLocalKey(date));

    setValue("slotStartDatetime", "");

    clearErrors("date");

    clearErrors("slotStartDatetime");
  };

  /* ====================================================================== */
  /* SUBMIT                                                                 */
  /* ====================================================================== */

  const onSubmitInternal = async (values: AppointmentFormValues) => {
    const slot = slots.find((item) => item.startDatetime === values.slotStartDatetime);

    if (!slot || slot.isBusy) {
      setError("slotStartDatetime", {
        type: "manual",

        message: "El horario seleccionado ya no está disponible.",
      });

      return;
    }

    /*
     * Volvemos a verificar disponibilidad
     * justo antes de crear la cita.
     */
    const latestSlots = await getSlotsByDentistAndDate(values.dentistId, values.date);

    const latestSlot = latestSlots.find((item) => item.startDatetime === slot.startDatetime);

    if (!latestSlot || latestSlot.isBusy) {
      setError("slotStartDatetime", {
        type: "manual",
        message: "Este horario acaba de dejar de estar disponible. Selecciona otro.",
      });

      return;
    }

    /* ---------------------------------------------------------------------- */
    /* PROMOTION SLOT VALIDATION                                              */
    /* ---------------------------------------------------------------------- */

    if (promotion && !isSlotInsidePromotion(latestSlot, promotion)) {
      setValue("slotStartDatetime", "");

      setError("slotStartDatetime", {
        type: "manual",

        message: "El horario seleccionado está fuera de la vigencia de la promoción.",
      });

      return;
    }

    const payload: CreateAppointment = {
      id_clinic: clinicId,
      id_patient: patientId,
      id_dentist: values.dentistId,
      start_datetime: latestSlot.startDatetime,
      end_datetime: latestSlot.endDatetime,
      reason: values.reason.trim(),
      id_promotion_requested: normalizedPromotionId,
    };

    console.log("Payload de cita:", payload);

    if (onSubmit) {
      await onSubmit(payload);
    }
  };

  /* ====================================================================== */
  /* RENDER SLOT                                                            */
  /* ====================================================================== */

  const renderSlot = (slot: AppointmentSlot, selectedValue: string, onChange: (value: string) => void) => {
    const selected = selectedValue === slot.startDatetime;

    return (
      <Pressable
        key={slot.startDatetime}
        onPress={() => {
          onChange(slot.startDatetime);

          clearErrors("slotStartDatetime");
        }}
        style={[
          styles.slot,
          {
            backgroundColor: selected ? c.primary : c.surface,

            borderColor: selected ? c.primary : c.border,
          },
        ]}
      >
        <Text
          style={[
            styles.slotText,
            {
              color: selected ? c.primaryContrast : c.textPrimary,
            },
          ]}
        >
          {slot.startHHMM}
        </Text>
      </Pressable>
    );
  };

  /* ====================================================================== */
  /* RENDER                                                                 */
  /* ====================================================================== */

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            backgroundColor: c.backdrop,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ================================================================= */}
        {/* HEADER                                                           */}
        {/* ================================================================= */}

        <View style={styles.header}>
          <Text
            style={[
              styles.eyebrow,
              {
                color: c.primary,
              },
            ]}
          >
            NUEVA CITA
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: c.textPrimary,
              },
            ]}
          >
            Agenda tu atención
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: c.textSecondary,
              },
            ]}
          >
            Elige profesional, fecha y horario.
          </Text>
        </View>

        {/* ================================================================= */}
        {/* PROMOTION CONTEXT                                               */}
        {/* ================================================================= */}

        {hasPromotion && (
          <View
            style={[
              styles.promotionNotice,
              {
                backgroundColor: c.surface,

                borderColor: promotionError ? c.danger : c.primary,
              },
            ]}
          >
            <View
              style={[
                styles.promotionNoticeIcon,
                {
                  backgroundColor: c.surfaceAlt,
                },
              ]}
            >
              {loadingPromotion ? (
                <ActivityIndicator size="small" color={c.primary} />
              ) : (
                <FontAwesome name={promotionError ? "exclamation-circle" : "tag"} size={15} color={promotionError ? c.danger : c.primary} />
              )}
            </View>

            <View style={styles.promotionNoticeContent}>
              {loadingPromotion ? (
                <>
                  <Text
                    style={[
                      styles.promotionNoticeTitle,
                      {
                        color: c.textPrimary,
                      },
                    ]}
                  >
                    Verificando promoción
                  </Text>

                  <Text
                    style={[
                      styles.promotionNoticeDescription,
                      {
                        color: c.textSecondary,
                      },
                    ]}
                  >
                    Estamos comprobando que siga disponible.
                  </Text>
                </>
              ) : promotionError ? (
                <>
                  <Text
                    style={[
                      styles.promotionNoticeTitle,
                      {
                        color: c.danger,
                      },
                    ]}
                  >
                    Promoción no disponible
                  </Text>

                  <Text
                    style={[
                      styles.promotionNoticeDescription,
                      {
                        color: c.textSecondary,
                      },
                    ]}
                  >
                    {promotionError}
                  </Text>
                </>
              ) : promotion ? (
                <>
                  <View style={styles.promotionTitleRow}>
                    <Text
                      style={[
                        styles.promotionNoticeTitle,
                        {
                          color: c.textPrimary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {promotion.name}
                    </Text>

                    <View
                      style={[
                        styles.promotionDiscountBadge,
                        {
                          backgroundColor: c.surfaceAlt,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.promotionDiscountText,
                          {
                            color: c.primary,
                          },
                        ]}
                      >
                        {formatPromotionDiscount(promotion)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.promotionNoticeDescription,
                      {
                        color: c.textSecondary,
                      },
                    ]}
                  >
                    Disponible hasta el {formatPromotionDate(promotion.endDate)}.
                  </Text>

                  <View style={styles.promotionMetaRow}>
                    <FontAwesome name="calendar-o" size={10} color={c.textMuted} />

                    <Text
                      style={[
                        styles.promotionMetaText,
                        {
                          color: c.textMuted,
                        },
                      ]}
                    >
                      Solo podrás seleccionar fechas y horarios dentro de su vigencia.
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        )}
        {/* ================================================================= */}
        {/* FORM CARD                                                        */}
        {/* ================================================================= */}

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: c.surface,

              borderColor: c.border,
            },
          ]}
        >
          {/* =============================================================== */}
          {/* 1. DENTIST                                                      */}
          {/* =============================================================== */}

          <FormSectionHeader c={c} number="1" title="Odontólogo" description="Selecciona el profesional." />

          {loadingDentists ? (
            <LoadingRow c={c} text="Cargando odontólogos..." />
          ) : dentistsError ? (
            <ErrorText c={c} text={dentistsError} />
          ) : dentists.length === 0 ? (
            <InfoBox c={c} icon="user-md" text="No hay odontólogos disponibles." />
          ) : (
            <Controller
              control={control}
              name="dentistId"
              render={({ field: { onChange, value } }) => (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dentistsContent}
                  style={styles.dentistsScroll}
                >
                  {dentists.map((dentist) => {
                    const selected = value === dentist.id;

                    return (
                      <Pressable
                        key={dentist.id}
                        onPress={() => handleSelectDentist(dentist.id, onChange)}
                        style={[
                          styles.dentistCard,
                          {
                            backgroundColor: selected ? c.surfaceAlt : c.surface,

                            borderColor: selected ? c.primary : c.border,
                          },
                        ]}
                      >
                        {/* AVATAR */}

                        <View
                          style={[
                            styles.dentistAvatar,
                            {
                              backgroundColor: c.surfaceAlt,
                            },
                          ]}
                        >
                          {dentist.photo ? (
                            <Image
                              source={{
                                uri: dentist.photo,
                              }}
                              style={styles.dentistImage}
                            />
                          ) : (
                            <FontAwesome name="user-md" size={17} color={c.primary} />
                          )}
                        </View>

                        {/* INFO */}

                        <View style={styles.dentistInfo}>
                          <Text
                            style={[
                              styles.dentistName,
                              {
                                color: c.textPrimary,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            Dr. {getDentistFullName(dentist)}
                          </Text>

                          <Text
                            style={[
                              styles.dentistSpeciality,
                              {
                                color: c.textMuted,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {getDentistPrimarySpeciality(dentist)}
                          </Text>
                        </View>

                        {/* CHECK */}

                        {selected && (
                          <View
                            style={[
                              styles.dentistCheck,
                              {
                                backgroundColor: c.primary,
                              },
                            ]}
                          >
                            <FontAwesome name="check" size={8} color={c.primaryContrast} />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            />
          )}

          {errors.dentistId && <ErrorText c={c} text={errors.dentistId.message!} />}

          <Divider c={c} />

          {/* =============================================================== */}
          {/* 2. DATE                                                         */}
          {/* =============================================================== */}

          <FormSectionHeader
            c={c}
            number="2"
            title="Fecha"
            description={selectedDentist ? `Disponibilidad de Dr. ${getDentistFullName(selectedDentist)}` : "Selecciona primero un odontólogo."}
          />

          {!selectedDentist ? (
            <InfoBox c={c} icon="user-md" text="Selecciona un odontólogo para continuar." />
          ) : (
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <WeekStrip
                  selectedDate={value ? dateKeyToDate(value) : null}
                  onSelect={(date: Date) => handleSelectDate(date, onChange)}
                  includeToday
                  daysAheadCount={30}
                  minDate={promotionMinDate}
                  maxDate={promotionMaxDate}
                />
              )}
            />
          )}

          {errors.date && <ErrorText c={c} text={errors.date.message!} />}

          <Divider c={c} />

          {/* =============================================================== */}
          {/* 3. SLOTS                                                        */}
          {/* =============================================================== */}

          <FormSectionHeader c={c} number="3" title="Horario" description={watchDate ? formatSelectedDate(watchDate) : "Selecciona una fecha."} />

          {!watchDentistId ? (
            <InfoBox c={c} icon="user-md" text="Selecciona un odontólogo." />
          ) : !watchDate ? (
            <InfoBox c={c} icon="calendar-o" text="Selecciona una fecha." />
          ) : loadingSlots ? (
            <LoadingRow c={c} text="Consultando horarios..." />
          ) : slotsError ? (
            <ErrorText c={c} text={slotsError} />
          ) : slots.length === 0 ? (
            <InfoBox c={c} icon="calendar-times-o" text="El odontólogo no atiende este día." />
          ) : availableSlots.length === 0 ? (
            <InfoBox
              c={c}
              icon="clock-o"
              text={promotion ? "No hay horarios disponibles dentro de la vigencia de esta promoción." : "No quedan horarios disponibles."}
            />
          ) : (
            <Controller
              control={control}
              name="slotStartDatetime"
              render={({ field: { onChange, value } }) => (
                <View>
                  {/* AVAILABILITY */}

                  <View style={styles.availabilityRow}>
                    <View style={styles.availabilityDot} />

                    <Text
                      style={[
                        styles.availabilityText,
                        {
                          color: c.textMuted,
                        },
                      ]}
                    >
                      {availableSlots.length} {availableSlots.length === 1 ? "horario disponible" : "horarios disponibles"}
                    </Text>
                  </View>

                  {/* MORNING */}

                  {morningSlots.length > 0 && (
                    <View style={styles.slotGroup}>
                      <Text
                        style={[
                          styles.slotGroupTitle,
                          {
                            color: c.textSecondary,
                          },
                        ]}
                      >
                        Mañana
                      </Text>

                      <View style={styles.slotsGrid}>{morningSlots.map((slot) => renderSlot(slot, value, onChange))}</View>
                    </View>
                  )}

                  {/* AFTERNOON */}

                  {afternoonSlots.length > 0 && (
                    <View style={styles.slotGroup}>
                      <Text
                        style={[
                          styles.slotGroupTitle,
                          {
                            color: c.textSecondary,
                          },
                        ]}
                      >
                        Tarde
                      </Text>

                      <View style={styles.slotsGrid}>{afternoonSlots.map((slot) => renderSlot(slot, value, onChange))}</View>
                    </View>
                  )}
                </View>
              )}
            />
          )}

          {errors.slotStartDatetime && <ErrorText c={c} text={errors.slotStartDatetime.message!} />}

          <Divider c={c} />

          {/* =============================================================== */}
          {/* 4. REASON                                                       */}
          {/* =============================================================== */}

          <FormSectionHeader c={c} number="4" title="Motivo" description="Cuéntanos brevemente qué necesitas." />

          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                multiline
                error={errors.reason?.message}
                containerStyle={{
                  marginTop: 4,
                  width: "100%",
                }}
              />
            )}
          />

          <Text
            style={[
              styles.characterCount,
              {
                color: c.textMuted,
              },
            ]}
          >
            {watchReason?.length ?? 0}
            /250
          </Text>
        </View>

        {/* ================================================================= */}
        {/* COMPACT SUMMARY                                                  */}
        {/* ================================================================= */}

        {selectedDentist && watchDate && selectedSlot && (
          <View
            style={[
              styles.summary,
              {
                backgroundColor: c.surfaceAlt,

                borderColor: c.border,
              },
            ]}
          >
            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor: c.surface,
                },
              ]}
            >
              <FontAwesome name="calendar-check-o" size={16} color={c.primary} />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={[
                  styles.summaryTitle,
                  {
                    color: c.textPrimary,
                  },
                ]}
                numberOfLines={1}
              >
                Dr. {getDentistFullName(selectedDentist)}
              </Text>

              <Text
                style={[
                  styles.summaryDescription,
                  {
                    color: c.textMuted,
                  },
                ]}
                numberOfLines={2}
              >
                {formatSelectedDate(watchDate)}
                {" · "}
                {selectedSlot.startHHMM}
                {" – "}
                {selectedSlot.endHHMM}
              </Text>
            </View>
          </View>
        )}

        {/* ================================================================= */}
        {/* SUBMIT                                                           */}
        {/* ================================================================= */}

        <Pressable
          onPress={handleSubmit(onSubmitInternal)}
          disabled={isSubmitting || !formReady}
          style={[
            styles.submit,
            {
              backgroundColor: c.primary,

              opacity: isSubmitting || !formReady ? 0.45 : 1,
            },
          ]}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color={c.primaryContrast} />

              <Text
                style={[
                  styles.submitText,
                  {
                    color: c.primaryContrast,
                  },
                ]}
              >
                Verificando...
              </Text>
            </>
          ) : (
            <>
              <FontAwesome name={hasPromotion ? "tag" : "calendar-check-o"} size={14} color={c.primaryContrast} />

              <Text
                style={[
                  styles.submitText,
                  {
                    color: c.primaryContrast,
                  },
                ]}
              >
                {hasPromotion ? "Agendar con promoción" : "Agendar cita"}
              </Text>
            </>
          )}
        </Pressable>

        <Text
          style={[
            styles.footerNote,
            {
              color: c.textMuted,
            },
          ]}
        >
          La disponibilidad se verifica nuevamente al confirmar.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ========================================================================== */
/*                              LOCAL COMPONENTS                              */
/* ========================================================================== */

function FormSectionHeader({
  c,
  number,
  title,
  description,
}: {
  c: ThemeColors;

  number: string;

  title: string;

  description: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View
        style={[
          styles.sectionNumber,
          {
            backgroundColor: c.surfaceAlt,

            borderColor: c.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionNumberText,
            {
              color: c.primary,
            },
          ]}
        >
          {number}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: c.textPrimary,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionDescription,
            {
              color: c.textMuted,
            },
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

function Divider({ c }: { c: ThemeColors }) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: c.border,
        },
      ]}
    />
  );
}

function InfoBox({ c, icon, text }: { c: ThemeColors; icon: React.ComponentProps<typeof FontAwesome>["name"]; text: string }) {
  return (
    <View
      style={[
        styles.infoBox,
        {
          backgroundColor: c.surfaceAlt,
        },
      ]}
    >
      <FontAwesome name={icon} size={12} color={c.primary} />

      <Text
        style={[
          styles.infoText,
          {
            color: c.textSecondary,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function LoadingRow({
  c,
  text,
}: {
  c: ThemeColors;

  text: string;
}) {
  return (
    <View style={styles.loadingRow}>
      <ActivityIndicator size="small" color={c.primary} />

      <Text
        style={[
          styles.loadingText,
          {
            color: c.textMuted,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function ErrorText({
  c,
  text,
}: {
  c: ThemeColors;

  text: string;
}) {
  return (
    <Text
      style={[
        styles.errorText,
        {
          color: c.danger,
        },
      ]}
    >
      {text}
    </Text>
  );
}

/* ========================================================================== */
/*                                   STYLES                                   */
/* ========================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 50,
  },

  /* ---------------------------------------------------------------------- */
  /* HEADER                                                                 */
  /* ---------------------------------------------------------------------- */

  header: {
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },

  description: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  /* ---------------------------------------------------------------------- */
  /* FORM                                                                   */
  /* ---------------------------------------------------------------------- */

  formCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    paddingTop: 14,
    marginBottom: 11,
  },

  sectionNumber: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionNumberText: {
    fontSize: 10,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  sectionDescription: {
    fontSize: 9,
    lineHeight: 13,
    marginTop: 1,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 15,
  },

  /* ---------------------------------------------------------------------- */
  /* DENTIST                                                                */
  /* ---------------------------------------------------------------------- */

  dentistsScroll: {
    marginHorizontal: -14,
  },

  dentistsContent: {
    paddingHorizontal: 14,
    gap: 8,
  },

  dentistCard: {
    width: 210,
    height: 68,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },

  dentistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  dentistImage: {
    width: "100%",
    height: "100%",
  },

  dentistInfo: {
    flex: 1,
    paddingRight: 18,
  },

  dentistName: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },

  dentistSpeciality: {
    fontSize: 9,
    marginTop: 2,
  },

  dentistCheck: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ---------------------------------------------------------------------- */
  /* AVAILABILITY                                                           */
  /* ---------------------------------------------------------------------- */

  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },

  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },

  availabilityText: {
    fontSize: 9,
    fontWeight: "600",
  },

  /* ---------------------------------------------------------------------- */
  /* SLOT                                                                   */
  /* ---------------------------------------------------------------------- */

  slotGroup: {
    marginTop: 5,
    marginBottom: 4,
  },

  slotGroupTitle: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 7,
  },

  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  slot: {
    minWidth: 72,
    height: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  slotText: {
    fontSize: 11,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  /* ---------------------------------------------------------------------- */
  /* INFO                                                                   */
  /* ---------------------------------------------------------------------- */

  infoBox: {
    minHeight: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  infoText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },

  loadingRow: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  loadingText: {
    fontSize: 9,
  },

  errorText: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 7,
  },

  characterCount: {
    alignSelf: "flex-end",
    fontSize: 8,
    marginTop: 3,
    marginBottom: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* SUMMARY                                                                */
  /* ---------------------------------------------------------------------- */

  summary: {
    minHeight: 65,
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  summaryTitle: {
    fontSize: 11,
    fontWeight: "700",
  },

  summaryDescription: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 13,
  },

  /* ---------------------------------------------------------------------- */
  /* SUBMIT                                                                 */
  /* ---------------------------------------------------------------------- */

  submit: {
    minHeight: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 13,
  },

  submitText: {
    fontSize: 12,
    fontWeight: "700",
  },

  footerNote: {
    textAlign: "center",
    fontSize: 8,
    lineHeight: 12,
    marginTop: 6,
    paddingHorizontal: 20,
  },

  promotionNotice: {
    borderWidth: 1,
    borderRadius: 14,

    paddingHorizontal: 11,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "flex-start",

    marginBottom: 13,
  },

  promotionNoticeIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,
  },

  promotionNoticeContent: {
    flex: 1,

    paddingRight: 8,
  },

  promotionNoticeTitle: {
    fontSize: 11,

    fontWeight: "700",
  },

  promotionNoticeDescription: {
    fontSize: 9,

    lineHeight: 14,

    marginTop: 2,
  },

  promotionTitleRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,
  },

  promotionDiscountBadge: {
    borderRadius: 999,

    paddingHorizontal: 7,

    paddingVertical: 3,
  },

  promotionDiscountText: {
    fontSize: 8,

    fontWeight: "800",
  },

  promotionMetaRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,

    marginTop: 5,
  },

  promotionMetaText: {
    flex: 1,

    fontSize: 8,

    lineHeight: 12,
  },
});
