import scala.collection.immutable.Map
import scala.collection.immutable.List
import net.liftweb.json._
import net.liftweb.json.Serialization.write

package idrya.check.spell {
  class SpellChecker{
    val dic = Map("war" -> "war", "warfare" -> "warfare", "do" -> "do", "doff" -> "doff",
                  "dof" -> "dof", "habla" -> "habla", "hablar" -> "hablar","faire" -> "faire",
                  "free" -> "free")


    //generate misspelled words with edit distance of 1 and 2 from the provided word
    //this function will basically delete caracters from the provided word
    //until getting a word with edit distance 1 and 2
    def generateMisspelling(aWord:String):List[String] = {
      val keyLength = aWord.length()
      //generate words with an edit distance of 1 from the provided word
      val keysEdit1 = for (i <- List.range(0, keyLength))
        //the formula string.substring(0,i) + string.substring(i+1)
        //will generate words from the provided word with edit distance of 1 from the
        //provided word
        yield(aWord.substring(0,i) + aWord.substring(i+1))

      //generate words with an edit distance of 2 from the provided word
      val keysEdit2 = for(i <- List.range(0, keyLength); j <- List.range(0,keyLength - 1))
        //first string.substring(0,i) + string.substring(i+1) is used to generate
        //words with edit distance of 1 and then the same formula is used over
        //the generated string in a double for loop (in case you haven't noticed yet).
        yield(((aWord.substring(0,i) + aWord.substring(i+1)).substring(0,j)) + ((aWord.substring(0,i) + aWord.substring(i+1)).substring(j+1)))

      //return the generated words(with edit distance of 1 and 2)
      (keysEdit1 ++ keysEdit2).distinct
    }
    //generates a list of possible misspelled words from a provided dictionary
    //this function is just used once
    def generateMisspellings(dic:Map[String,String]):Map[String,List[String]] = {
      //dictionary to save possible mispelled words
      var spell = Map.empty[String, List[String]]

      // create a dictionary of possible mispelled words with a maping to
      // the correct spelling form
      for ((k,v) <- dic; i <- generateMisspelling(v)){
        //println("current i: "+i)
        if(spell.contains(i))
          //println("anYtes de la modif: "+spell(i))
          spell += i -> (v::spell(i))
          //println("despues de la modif: "+spell(i))}
        else
          spell += (i->List(v))
      }
      spell
    }

    //return spelling correction suggestions for the provided input
    def getSuggestions(posMisspelings:Map[String,List[String]],
                       dic:Map[String,String], input:String):List[String] = {

      // generate key with edit distance of 1 and 2 from the provided input
      // to compare then against the dictionary of correct writen words
      val posiblewords = generateMisspelling(input)
      //list to save spelling suggestions that could come from the correct writen
      //search for suggestions in the correct writen word dictionary
      val suggestions = for(i <- posiblewords if dic.contains(i)) yield(dic(i))
      val moreSuggestions = for(i <- posiblewords if posMisspelings.contains(i)) yield(posMisspelings(i))

      //get suggestions from the possible misspelled words dictionary
      //var moreSuggestions = posMisspelings.get(input) match {
      //  case Some(value) => value
      //  case None => Nil
      //}

      // return a list of strings with posible spelling corrections
      // without duplicates
      (suggestions ++ moreSuggestions.flatten).distinct
    }

    def suggestionsToJson(input:String):String = {
      implicit val formats = net.liftweb.json.DefaultFormats
      val suggestions = write(getSuggestions(generateMisspellings(dic),dic,input))
      suggestions
    }
  }
}
