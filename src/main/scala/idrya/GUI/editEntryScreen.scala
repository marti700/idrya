package idrya.GUI

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

object EditEntryScreen extends AddEditEntry{
  this.saveButton.onAction = (e:ActionEvent) => {
    println("Editing this entry")
  }
}
