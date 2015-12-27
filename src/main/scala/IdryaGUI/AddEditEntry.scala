package IdryaGUI

import scalafx.application.JFXApp
import scalafx.scene.Scene
import scalafx.scene.control.Button
import scalafx.scene.control.Label
import scalafx.scene.control.TextField
import scalafx.scene.control.TextArea
import scalafx.scene.layout.HBox
import scalafx.scene.layout.VBox
import scalafx.scene.layout.BorderPane
import scalafx.geometry.Insets
import scalafx.geometry.Pos
import scalafx.collections.ObservableBuffer
import scalafx.beans.property.StringProperty
import scalafx.beans.property.ObjectProperty
import scalafx.Includes._
import scalafx.event.ActionEvent

class AddEditEntry extends scalafx.scene.Scene{

  //*************************SCREEN CONTROLS*********************************//
  //back and save buttons
  val backbutton = new Button("Go Back")
  val saveButton = new Button("Save")
  //sets a event handler to the button (in this contex onAction = onClick)
  //the handler sets the stage scene to be the main scene
  backbutton.onAction = (e:ActionEvent) => {Idrya.stage.scene = MainScene}

  val titleLabel = new Label("Entry Title")
  //in this text field goes the title of the entry
  val titleTextField = new TextField
  //in this text area goes the content of the entry
  val entryContentTextArea = new TextArea
  //*****************************SCREEN CONTROLS END**************************//
  //*************************SCREEN MAIN CONTAINER***************************//
  val mainContainer = new BorderPane{
    //distance between elements
    padding = Insets(25)
    //sets top area of the BorderPane to be a HBox
    top = new HBox {
      spacing = 10 //separates all elements in this Pane by 10 pixels
      //adds controls to the HBox pane
      children = List(backbutton, saveButton)
    }
    //sets the center area of the BorderPane to be a VBox
    center = new VBox {
      spacing = 10
        //adds controls to the VBox pane
        children = List(titleLabel, titleTextField, entryContentTextArea)
    }
  }
  //***************************SCREEN MAIN CONTAINER END**********************//
  root = mainContainer
}
