import {
  Platform,
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    /* ====================================================================== */
    /* GENERAL                                                                */
    /* ====================================================================== */

    container: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 130,
    },

    bottomSpace: {
      height: 30,
    },

    section: {
      marginBottom: 22,
    },

    /* ====================================================================== */
    /* LOADING                                                                */
    /* ====================================================================== */

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      paddingHorizontal: 30,
    },

    loadingIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor:
        "rgba(0,84,130,0.10)",
      alignItems: "center",
      justifyContent:
        "center",
    },

    loadingText: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: "500",
    },

    /* ====================================================================== */
    /* INTRO                                                                  */
    /* ====================================================================== */

    introSection: {
      paddingTop: 5,
      marginBottom: 22,
    },

    introEyebrow: {
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 1.4,
      marginBottom: 5,
    },

    introTitle: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: "700",
    },

    introDescription: {
      marginTop: 5,
      maxWidth: 330,
      fontSize: 12,
      lineHeight: 18,
    },

    /* ====================================================================== */
    /* SECTION                                                                */
    /* ====================================================================== */

    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 9,
    },

    sectionTitle: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "700",
      marginBottom: 9,
    },

    sectionHint: {
      fontSize: 9,
      marginBottom: 9,
    },

    /* ====================================================================== */
    /* FEATURED APPOINTMENT                                                   */
    /* ====================================================================== */

    featuredCard: {
      minHeight: 220,
      borderRadius: 22,
      overflow: "hidden",
      backgroundColor:
        "#005482",
      padding: 17,

      ...Platform.select({
        ios: {
          shadowColor:
            "#005482",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.2,
          shadowRadius: 18,
        },

        android: {
          elevation: 5,
        },
      }),
    },

    featuredGlowOne: {
      position: "absolute",
      width: 210,
      height: 210,
      borderRadius: 105,
      backgroundColor:
        "rgba(255,255,255,0.07)",
      right: -70,
      top: -95,
    },

    featuredGlowTwo: {
      position: "absolute",
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor:
        "rgba(255,255,255,0.04)",
      left: -50,
      bottom: -75,
    },

    featuredTop: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      justifyContent:
        "space-between",
    },

    featuredDate: {
      width: 58,
      height: 62,
      borderRadius: 16,
      backgroundColor:
        "rgba(255,255,255,0.13)",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.12)",
      alignItems: "center",
      justifyContent:
        "center",
    },

    featuredDateDay: {
      color: "#FFFFFF",
      fontSize: 22,
      lineHeight: 24,
      fontWeight: "800",
    },

    featuredDateMonth: {
      marginTop: 2,
      color:
        "rgba(255,255,255,0.70)",
      fontSize: 8,
      letterSpacing: 1.2,
      fontWeight: "800",
    },

    featuredState: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },

    featuredStateDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 5,
    },

    featuredStateText: {
      fontSize: 9,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    featuredBody: {
      flex: 1,
      justifyContent:
        "center",
      paddingTop: 14,
      paddingBottom: 12,
    },

    featuredTime: {
      color:
        "rgba(255,255,255,0.72)",
      fontSize: 11,
      fontWeight: "600",
      marginBottom: 6,
    },

    featuredReason: {
      color: "#FFFFFF",
      fontSize: 20,
      lineHeight: 25,
      //fontWeight: "750",
      maxWidth: 280,
    },

    featuredDentistRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 9,
    },

    featuredDentist: {
      color:
        "rgba(255,255,255,0.78)",
      fontSize: 11,
      flex: 1,
    },

    featuredFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderTopColor:
        "rgba(255,255,255,0.18)",
      paddingTop: 12,
    },

    featuredRelative: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    featuredRelativeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "600",
    },

    featuredDetails: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    featuredDetailsText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
    },

    /* ====================================================================== */
    /* NO NEXT APPOINTMENT                                                    */
    /* ====================================================================== */

    noNextCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      borderWidth: 1,
      padding: 15,
    },

    noNextIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "rgba(0,84,130,0.09)",
      marginRight: 12,
    },

    noNextContent: {
      flex: 1,
    },

    noNextTitle: {
      fontSize: 13,
      fontWeight: "700",
    },

    noNextDescription: {
      fontSize: 10,
      lineHeight: 15,
      marginTop: 3,
    },

    /* ====================================================================== */
    /* SCHEDULE CTA                                                           */
    /* ====================================================================== */

    scheduleButton: {
      minHeight: 66,
      borderRadius: 17,
      backgroundColor:
        "#516067",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      marginBottom: 22,
      gap: 11,

      ...Platform.select({
        ios: {
          shadowColor:
            "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },

        android: {
          elevation: 3,
        },
      }),
    },

    scheduleButtonIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        "rgba(255,255,255,0.12)",
      alignItems: "center",
      justifyContent:
        "center",
    },

    scheduleButtonTitle: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    scheduleButtonSubtitle: {
      color:
        "rgba(255,255,255,0.65)",
      fontSize: 9,
      marginTop: 2,
    },

    /* ====================================================================== */
    /* SUMMARY                                                                */
    /* ====================================================================== */

    summaryContainer: {
      minHeight: 94,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 7,
      paddingVertical: 13,
    },

    summaryItem: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    summaryIcon: {
      width: 29,
      height: 29,
      borderRadius: 9,
      alignItems: "center",
      justifyContent:
        "center",
      marginBottom: 5,
    },

    summaryValue: {
      fontSize: 17,
      lineHeight: 20,
      fontWeight: "800",
    },

    summaryLabel: {
      fontSize: 9,
      marginTop: 2,
      fontWeight: "500",
    },

    summaryDivider: {
      width:
        StyleSheet.hairlineWidth,
      height: 47,
    },

    /* ====================================================================== */
    /* FILTERS                                                                */
    /* ====================================================================== */

    segmentedControl: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 14,
      padding: 4,
      minHeight: 48,
    },

    segmentedItem: {
      flex: 1,
      minHeight: 38,
      borderRadius: 10,
      alignItems: "center",
      justifyContent:
        "center",
    },

    segmentedItemActive: {
      backgroundColor:
        "#005482",
    },

    segmentedText: {
      fontSize: 10,
      fontWeight: "700",
    },

    /* ====================================================================== */
    /* LIST HEADER                                                            */
    /* ====================================================================== */

    listHeader: {
      marginTop: 1,
      marginBottom: 12,
    },

    listTitle: {
      fontSize: 15,
      fontWeight: "700",
    },

    listSubtitle: {
      marginTop: 2,
      fontSize: 9,
    },

    dateHeader: {
      marginTop: 13,
      marginBottom: 8,
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 0.9,
    },

    /* ====================================================================== */
    /* APPOINTMENT CARD                                                       */
    /* ====================================================================== */

    appointmentCard: {
      flexDirection: "row",
      borderRadius: 17,
      borderWidth: 1,
      paddingVertical: 14,
      paddingHorizontal: 12,
      marginBottom: 9,

      ...Platform.select({
        ios: {
          shadowColor:
            "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.035,
          shadowRadius: 6,
        },

        android: {
          elevation: 1,
        },
      }),
    },

    appointmentTimeColumn: {
      width: 55,
      alignItems: "center",
      position: "relative",
      paddingTop: 1,
    },

    appointmentTime: {
      fontSize: 12,
      fontWeight: "700",
      fontVariant: [
        "tabular-nums",
      ],
    },

    appointmentTimelineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 11,
      zIndex: 2,
    },

    appointmentTimelineLine: {
      position: "absolute",
      width: 1,
      top: 45,
      bottom: -15,
    },

    appointmentContent: {
      flex: 1,
      paddingLeft: 7,
    },

    appointmentHeader: {
      flexDirection: "row",
      alignItems:
        "flex-start",
    },

    appointmentTitle: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700",
    },

    appointmentDentistRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 5,
    },

    appointmentDentist: {
      fontSize: 10,
      flex: 1,
    },

    stateChip: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 7,
      paddingVertical: 4,
      gap: 4,
    },

    stateChipText: {
      fontSize: 8,
      fontWeight: "700",
    },

    appointmentMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 11,
      marginTop: 11,
    },

    appointmentMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    appointmentMetaText: {
      fontSize: 9,
      fontWeight: "500",
    },

    appointmentBottom: {
      marginTop: 11,
      paddingTop: 10,
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderTopColor:
        "rgba(148,163,184,0.18)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "flex-end",
      gap: 7,
    },

    appointmentOpenText: {
      fontSize: 9,
      fontWeight: "700",
    },

    /* ====================================================================== */
    /* EMPTY                                                                  */
    /* ====================================================================== */

    emptyContainer: {
      borderWidth: 1,
      borderRadius: 18,
      paddingVertical: 24,
      paddingHorizontal: 20,
      alignItems: "center",
      marginTop: 3,
    },

    emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor:
        "rgba(0,84,130,0.09)",
      alignItems: "center",
      justifyContent:
        "center",
    },

    emptyTitle: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },

    emptyDescription: {
      marginTop: 5,
      maxWidth: 280,
      fontSize: 10,
      lineHeight: 16,
      textAlign: "center",
    },

    emptyButton: {
      marginTop: 16,
      minHeight: 39,
      borderRadius: 11,
      paddingHorizontal: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#005482",
      gap: 7,
    },

    emptyButtonText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
    },

    /* ====================================================================== */
    /* DETAIL SHEET                                                           */
    /* ====================================================================== */

    sheet: {
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 35,
    },

    sheetHandle: {
      alignSelf: "center",
      width: 42,
      height: 4,
      borderRadius: 999,
      marginBottom: 18,
    },

    sheetHeader: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      gap: 10,
      marginBottom: 18,
    },

    sheetEyebrow: {
      fontSize: 8,
      letterSpacing: 1.2,
      fontWeight: "800",
      marginBottom: 4,
    },

    sheetTitle: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: "700",
    },

    sheetSubtitle: {
      fontSize: 10,
      marginTop: 3,
    },

    /* ====================================================================== */
    /* DETAIL DATE HERO                                                       */
    /* ====================================================================== */

    sheetDateHero: {
      borderRadius: 18,
      backgroundColor:
        "#005482",
      padding: 16,
      minHeight: 84,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 13,
    },

    sheetDateHeroRight: {
      alignItems: "flex-end",
    },

    sheetDateHeroLabel: {
      color:
        "rgba(255,255,255,0.58)",
      fontSize: 7,
      letterSpacing: 1.1,
      fontWeight: "800",
      marginBottom: 5,
    },

    sheetDateHeroDate: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
      maxWidth: 190,
    },

    sheetDateHeroTime: {
      color: "#FFFFFF",
      fontSize: 14,
     // fontWeight: "750",
      fontVariant: [
        "tabular-nums",
      ],
    },

    /* ====================================================================== */
    /* DETAIL CARD                                                            */
    /* ====================================================================== */

    sheetCard: {
      borderRadius: 17,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 4,
      marginTop: 12,
    },

    sheetRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },

    sheetIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 11,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 11,
    },

    sheetLabel: {
      fontSize: 8,
      textTransform:
        "uppercase",
      letterSpacing: 0.6,
      fontWeight: "700",
    },

    sheetValue: {
      marginTop: 3,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "600",
    },

    sheetDivider: {
      height:
        StyleSheet.hairlineWidth,
    },

    /* ====================================================================== */
    /* MOTIVE                                                                 */
    /* ====================================================================== */

    motiveBox: {
      borderWidth: 1,
      borderRadius: 17,
      padding: 14,
    },

    motiveLabel: {
      fontSize: 8,
      letterSpacing: 0.8,
      fontWeight: "800",
    },

    motiveText: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "600",
    },

    /* ====================================================================== */
    /* CANCELLED / STATUS                                                     */
    /* ====================================================================== */

    sheetStatusSection: {
      marginTop: 19,
    },

    sheetStatusTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginBottom: 8,
    },

    sheetStatusTitle: {
      fontSize: 12,
      fontWeight: "700",
    },

    sheetStatusBox: {
      borderWidth: 1,
      borderRadius: 16,
      padding: 14,
    },

    sheetStatusLabel: {
      fontSize: 8,
      fontWeight: "800",
      letterSpacing: 0.7,
    },

    sheetStatusValue: {
      marginTop: 5,
      fontSize: 11,
      lineHeight: 16,
    },

    /* ====================================================================== */
    /* ATTENDED                                                               */
    /* ====================================================================== */

    attendedNotice: {
      marginTop: 14,
      borderRadius: 16,
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
    },

    attendedIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor:
        "rgba(16,185,129,0.12)",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 10,
    },

    attendedTitle: {
      color: "#059669",
      fontSize: 11,
      fontWeight: "700",
    },

    attendedDescription: {
      marginTop: 2,
      fontSize: 9,
      lineHeight: 14,
    },

    /* ====================================================================== */
    /* RESCHEDULED                                                            */
    /* ====================================================================== */

    rescheduledNotice: {
      marginTop: 14,
      borderRadius: 16,
      padding: 13,
      flexDirection: "row",
      alignItems:
        "flex-start",
    },

    rescheduledIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor:
        "rgba(139,92,246,0.12)",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 10,
    },

    rescheduledTitle: {
      color: "#8B5CF6",
      fontSize: 11,
      fontWeight: "700",
    },

    rescheduledDescription: {
      marginTop: 3,
      fontSize: 9,
      lineHeight: 14,
    },

    /* ====================================================================== */
    /* DANGER                                                                 */
    /* ====================================================================== */

    sheetDangerSection: {
      marginTop: 22,
    },

    sheetDangerLabel: {
      fontSize: 9,
      marginBottom: 7,
    },

    dangerButton: {
      minHeight: 43,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        "rgba(239,68,68,0.30)",
      backgroundColor:
        "rgba(239,68,68,0.06)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      gap: 7,
    },

    dangerButtonText: {
      color: "#EF4444",
      fontSize: 10,
      fontWeight: "700",
    },
  });