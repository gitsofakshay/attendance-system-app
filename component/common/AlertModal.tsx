import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ModalProps,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../utils/colors';

interface AlertModalProps extends Omit<ModalProps, 'visible'> {
  visible: boolean;
  title: string;
  message: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  isDangerous?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  okText = 'OK',
  cancelText = 'Cancel',
  onOk,
  onCancel,
  isDangerous = false,
  ...rest
}) => (
  <Modal visible={visible} transparent animationType="fade" {...rest}>
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <MaterialIcons
          name={isDangerous ? 'warning' : 'info'}
          size={40}
          color={isDangerous ? Colors.danger : Colors.primary}
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttons}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          {onOk && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.okButton,
                isDangerous && styles.dangerButton,
              ]}
              onPress={onOk}
            >
              <Text style={styles.okText}>{okText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: Colors.primary,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  okText: {
    color: Colors.white,
    fontWeight: '600',
  },
  cancelText: {
    color: Colors.dark,
    fontWeight: '600',
  },
});
