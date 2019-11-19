<script>
  import { onMount } from "svelte";
  function romanToArabic(romanNumber) {
    romanNumber = romanNumber.toUpperCase();
    const romanNumList = [
      "CM",
      "M",
      "CD",
      "D",
      "XC",
      "C",
      "XL",
      "L",
      "IX",
      "X",
      "IV",
      "V",
      "I"
    ];
    const corresp = [900, 1000, 400, 500, 90, 100, 40, 50, 9, 10, 4, 5, 1];
    let index = 0,
      num = 0;
    for (let rn in romanNumList) {
      index = romanNumber.indexOf(romanNumList[rn]);
      while (index != -1) {
        num += parseInt(corresp[rn]);
        romanNumber = romanNumber.replace(romanNumList[rn], "-");
        index = romanNumber.indexOf(romanNumList[rn]);
      }
    }
    return num;
  }

  export let decision;
  onMount(function(params) {
    document.getElementsByTagName("input")[0].focus();
    [{ id: 0, len: 3 }, { id: 1, len: 3 }, { id: 2, len: 4 }].forEach(function(
      i
    ) {
      // Global eek! Any way this is just for fun.
      document
        .getElementsByTagName("input")
        [i.id].addEventListener("keyup", function(event) {
          var numStr = romanToArabic(event.target.value) + "";
          if (event.target.value && romanToArabic(event.target.value)) {
            document.getElementById("out" + i.id).innerHTML = numStr.padStart(
              i.len,
              "0"
            );
          }
        });
    });
  });

  function handleSubmit(event) {
    event.preventDefault();
    alert("Grazie mille! Permitte Divis Cetera");

    decision(true);
  }
</script>

<style>
  .container {
    background: white;
    padding: 0.5rem 1rem;
  }
  input {
    text-transform: uppercase;
  }
  .caption {
    font-style: italic;
    font-size: 14px;
  }
</style>

<div class="container">
  <form on:submit={handleSubmit}>
    Enter your phone number using Roman numerals
    <div>
      <input
        size="10"
        value="DCCCLXXXVIII"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false" />
      <input
        size="10"
        value="DCCCLXXXVIII"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false" />
      <input
        size="26"
        value="MMMMMMMMDCCCLXXXVIII"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false" />
    </div>
    Schedule one quadrillion robocalls to
    <b id="out0">888</b>
    -
    <b id="out1">888</b>
    -
    <b id="out2">8888</b>
    <input type="submit" value="Send" />
  </form>
  <div class="caption">
    For your convenience, use MMMMM for 5000 instead of
    <span style="text-decoration:overline">V</span>
    <br />
    Reference: M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1
  </div>
</div>
