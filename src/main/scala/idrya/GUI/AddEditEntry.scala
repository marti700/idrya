package idrya.GUI

import scalafx.application.JFXApp
import scalafx.scene.Scene
import scalafx.scene.control.Button
import scalafx.scene.control.Label
import scalafx.scene.control.TextField
import scalafx.scene.control.TextArea
import scalafx.scene.web.HTMLEditor
import scalafx.scene.web.WebView
import scalafx.scene.web.WebEvent
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
import netscape.javascript.JSObject
import idrya.check.spell.SpellChecker

//bridge class to comunicate this class with the SpellChecker class
//this is temparary, is just to ensure that the javascript in the WebView
//can comuticate with the SpellChecker
class AddEditEntrySpellCheckerBridge(){
  val checker = new SpellChecker()
  def suggestions(aWord:String):String = {checker.suggestionsToJson(aWord)}
}

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
  val entryContentWebView = new WebView{
    engine.load(getClass.getResource("/editor.html").toExternalForm())
    engine.onAlert = (e: WebEvent[_]) => {println(e.data)}
  }
  //prepare entryContentWebView to call scala methods in the context of
  //the DOM window
  var win = entryContentWebView.getEngine().executeScript("window").asInstanceOf[JSObject]
  //set checker as a member of the window so it can be called in
  //javascript as checker.method
  win.setMember("checker", new AddEditEntrySpellCheckerBridge())
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
        children = List(titleLabel, titleTextField, entryContentWebView)
    }
  }
  //***************************SCREEN MAIN CONTAINER END**********************//

  //sets the BorderPane as the root element in this stage
  root = mainContainer
}
