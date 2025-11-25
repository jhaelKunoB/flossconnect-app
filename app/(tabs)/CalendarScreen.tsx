import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Header from '@/components/HeaderScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from "@/components/ui/icon-symbol";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WeekStrip from '@/components/Calendar/WeekStrip';



export default function CalendarScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Header showBackButton={true} title='Calendario'
        rightComponent={
          <TouchableOpacity
            onPress={() => console.log("Agendar cita")}
            accessibilityLabel="Agendar cita"
            activeOpacity={0.7}
          >
            {/* Sugerencias de ícono Material: 'event-available', 'event-note', 'add-circle-outline' */}
            <FontAwesome name="calendar-plus-o" size={25} color="#222" />
          </TouchableOpacity>
        } />



      {/* Contenido */}
      <View style={{ paddingTop: 8 }}>
        <WeekStrip
          // por defecto: 5 días, desde mañana
         
          onSelect={(d) => console.log("Día seleccionado:", d.toISOString())}
        />
      </View>


    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
