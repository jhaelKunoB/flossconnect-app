import { PatientHomePromotion } from "@/types/home";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { PromotionCard } from "./PromotionCard";
import { PromotionDetailsSheet } from "./PromotionDetailsSheet";

type Props = {
  promotions: PatientHomePromotion[];
  onSchedulePromotion: (promotion: PatientHomePromotion) => void;
};

export function PromotionsSection({ promotions, onSchedulePromotion }: Props) {
  const sheetRef = useRef<ActionSheetRef>(null);

  const [selectedPromotion, setSelectedPromotion] = useState<PatientHomePromotion | null>(null);

  const handleOpenPromotion = (promotion: PatientHomePromotion) => {
    setSelectedPromotion(promotion);

    requestAnimationFrame(() => {
      sheetRef.current?.show();
    });
  };

  const handleSchedule = (promotion: PatientHomePromotion) => {
    sheetRef.current?.hide();

    setTimeout(() => {
      onSchedulePromotion(promotion);
    }, 180);
  };

  if (promotions.length === 0) {
    return null;
  }

  return (
    <>
      <View style={styles.section}>
        <HomeSectionHeader title="Promociones disponibles" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content} style={styles.scroll}>
          {promotions.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} onPress={() => handleOpenPromotion(promotion)} />
          ))}
        </ScrollView>
      </View>

      <PromotionDetailsSheet ref={sheetRef} promotion={selectedPromotion} onSchedule={handleSchedule} />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 21,
  },

  scroll: {
    marginHorizontal: -16,
  },

  content: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 2,
  },
});
