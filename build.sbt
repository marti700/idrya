name := "Idrya"

scalaVersion := "2.11.7"

unmanagedJars in Compile += {
  val ps = new sys.SystemProperties
  val jh = ps("java.home")
  Attributed.blank(file(jh) / "lib/ext/jfxrt.jar")
}

libraryDependencies ++= Seq(
  "org.scalafx" %% "scalafx" % "8.0.60-R9",
  "org.scala-lang.modules" %% "scala-xml" % "1.0.5"
)

