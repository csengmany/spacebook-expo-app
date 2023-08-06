import React from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from "../assets/colors";
const { green, red, darkgray} = colors;

const ConfirmationModal = ({ isBookingCancelled, setIsRefreshing, displayModal, isLoading, errorMessage, closeModal, handleConfirmCancelation }) => {
  return (
    <Modal visible={displayModal} transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        {isLoading && <Ionicons name="close" size={20} color="black" onPress={closeModal} />}
        <View style={styles.confirmBox}>
          {isLoading ? (
            <View style={styles.loadingCancelation}>
              <Text>Traitement de votre demande en cours</Text>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            errorMessage||isBookingCancelled ? (
            <>
              <Text style={styles.text}>{errorMessage? errorMessage: "Votre réservation a bien été annulé."}</Text>
              <View style={styles.confirmBtnWrapper}>
                <TouchableOpacity style={styles.btnConfirm} onPress={()=>{
                  setIsRefreshing(true)
                  closeModal()
                }}>
                  <Text style={styles.btnText}>OK</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : 
            <>
              <Text>Êtes-vous sûr de vouloir annuler votre réservation ?</Text>
              <View style={styles.confirmBtnWrapper}>
                <TouchableOpacity style={styles.btnCancel} onPress={closeModal}>
                  <Text style={styles.btnText}>Non</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmCancelation}>
                  <Text style={styles.btnText}>Oui</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    maxWidth: 300,
  },
  confirmBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  btnConfirm: {
    backgroundColor: red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnCancel: {
    backgroundColor: darkgray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingCancelation: {
    alignItems: 'center',
  },
  text:{
    fontFamily:"NotoSans",
  },
  success:{
      color:green,
  },
  error:{
    color:"red"
  },
});

export default ConfirmationModal;
