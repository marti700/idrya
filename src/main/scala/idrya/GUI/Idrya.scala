package idrya.GUI

import scalafx.application.JFXApp

object Idrya extends JFXApp{
  //initialize Primary Stage
   stage = new JFXApp.PrimaryStage {
    title = "Idrya"

    scene = MainScene //Set the stage scene
  }
}
