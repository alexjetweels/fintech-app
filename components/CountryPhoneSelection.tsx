import Colors from '@/constants/Colors';
import { CountryCode } from '@/constants/ContryCode';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

interface CountryPhoneSelectionProps {
  value: string;
  onChange: (value: string) => void;
}
const CountryPhoneSelection = ({
  value = '+84',
  onChange,
}: CountryPhoneSelectionProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>{value}</Text>
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name='close-sharp' size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>

            <FlatList
              style={{ maxHeight: 300 }}
              data={CountryCode}
              keyExtractor={(item) =>
                `${item.name}-${item.dial_code}-${item.code}`
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.dial_code === value ? styles.activeItem : null,
                  ]}
                  onPress={() => {
                    onChange(item.dial_code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.flag}</Text>
                  <Text style={styles.optionText}>({item.dial_code})</Text>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    gap: 5,
  },
  optionText: {
    paddingVertical: 12,
    fontSize: 16,
  },
  activeItem: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingLeft: 3,
  },
});

export default CountryPhoneSelection;
