package idrya.GUI

import scalafx.application.JFXApp
import scalafx.scene.Scene
import scalafx.scene.control.Button
import scalafx.scene.control.Label
import scalafx.scene.control.TableView
import scalafx.scene.control.TableColumn
import scalafx.scene.control.TextArea
import scalafx.scene.layout.HBox
import scalafx.scene.layout.BorderPane
import scalafx.geometry.Insets
import scalafx.geometry.Pos
import scalafx.collections.ObservableBuffer
import scalafx.beans.property.StringProperty
import scalafx.beans.property.ObjectProperty
import scalafx.Includes._
import scalafx.event.ActionEvent

//this test stuff this case clase don't go here don't dare you leave this case class here
case class Entry(title:String, date:String)

object MainScene extends scalafx.scene.Scene {
  //sets the root of the scene to a Border Pane
  root = new BorderPane{
    padding = Insets(25)
    //sets top area of the Border Pane to be a HBox
    top = new HBox{
      spacing = 10 // separete all the Items in this HBox by 10 pixels
      //alignment = Pos.CENTER_LEFT

      //creates the Edit buttons
      //(the ones that allow adding, editing and deleting entries)
      val addEntryButton = new Button("Add")
      val editEntryButton = new Button("Edit")
      val deleteEntryButton = new Button("Delete")

      //DEFINE EVENT HANDLERS FOR THE BUTTONS
      //event handler for the add entry button
      addEntryButton.onAction = (e:ActionEvent) => {Idrya.stage.scene = AddEntryScreen}

      //define Event handler for the edit entry button
      editEntryButton.onAction = (e:ActionEvent) => {Idrya.stage.scene = EditEntryScreen}

      //add the buttons to the HBox pane by calling children_ (which is a setter)
      children = List(addEntryButton,editEntryButton,deleteEntryButton)
    }

    //creates an ObservableBuffer(
    //which is a wrapper around the javafx ObservableList)
    //to set the model of the entries table view
    //here for testing please man, don't leave this here
    val data = ObservableBuffer(
      Entry("This","01/01/2016"),
      Entry("is","01/02/2016"),
      Entry("Idrya","01/03/2016")
    )
    //creates a table view to hold entries information
    val entriesTableView = new TableView(data)
    //creates a column for the title
    val titleColumn = new TableColumn[Entry,String]("Title")
    //data for the title column
    titleColumn.cellValueFactory = cdf => StringProperty(cdf.value.title)
    //creates a column for the date
    val dateColumn = new TableColumn[Entry,String]("Date")
    //creates a column for the date column
    dateColumn.cellValueFactory = cdf => StringProperty(cdf.value.date)

    //putting the table together
    entriesTableView.columns ++= List(titleColumn,dateColumn)

    // sets the left area of the Border Pane to be the entries Table View
    left = entriesTableView

    //creates a text area
    val entryContentTextArea = new TextArea("Anything here yet")

    //Sets the center area of the Border Pane to be a Text Area
    center = entryContentTextArea
  }
}
