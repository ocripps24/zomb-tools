# MAP ELEMENTS

A high-performance web application to help track essential data while playing Zombies.

## Games

### BO3

#### Shadows of Evil

- **Steps**
  - Egg Symbols - record symbols -> present custom formatted guide for how to use the data
- **Reusable Components**
  - symbol picker

#### The Giant

- **Steps**
  - Show toy spots and pointers/references for hitting with grenades
- ## **Reusable Components**

#### Der Eisendrache

- **Steps**
  - Safe Symbols - record symbols -> present ordered list of symbols for user to enter in-game
  - Wisps - show locations and allow user to select which wisps they have to to potentially use algorithm to determine where next wisp could be
  - Simon says - user enters symbol order -> display symbol order for user to reference
- **Reusable Components**
  - symbol picker

#### Zetsubou No Shima

- **Steps**
  - TBC
- ## **Reusable Components**
  - TBC

#### Gorod Krovi

- **Steps**
  - TBC
- ## **Reusable Components**
  - TBC

#### Revelations

- **Steps**
  - TBC
- ## **Reusable Components**
  - TBC

### BO4

#### Voyage of Despair

- **Steps**
  - Clocks - record symbols, times & locations -> present custom formatted guide for how to use the data
  - Outlets - record outlet locations and associated catalyst types -> present custom formatted guide for how to use the data
  - Planets - record planet order -> display completed list
- **Reusable Components**
  - symbol picker
  - selecting items from an 'available' list to display them in order in a 'completed' list
  - data entry - sliders, text inputs, steppers, from Clocks step

#### IX

- **Steps**
  - Ra Bull symbols - show locations with associated pictures of the bull symbols to shoot
  - Ra Lockdown - record symbols from Ra column as they appear in game -> translate symbols to enemy type for user in ordered list
  - Odin pylons - show locations with associated pictures of the pylons to shoot
  - Zeus symbols - show locations of symbols to shoot with pointers/reference on where to shoot them
- **Reusable Components**
  - symbol picker

#### Blood of the Dead

- **Steps**
  - General - record 3 digit numbers that can be entered elsewhere in game
  - Samantha Says - record order of generators, record final 3 generators, record tv symbols -> present user with custom formatted guide to show symbol positioning on generators
  - Morse code - user has to enter a number in morse code. The number can be obtained by looking at 3 buoys around the map and noting the morse code signal they emit before adding them together or it can be brute forced. It's quicker and probably easier to brute force it as there is a failure mechnic of the warden laughing when you enter in an incorrect dot/dash. You can use that to guess the number, which more often than not will be between 6-15 by entering in the morse code for 1. If there are no laughs then we no it is 10 or higher. If we then enter in the morse code for 5, depending on when we here the laugh we will then be able to further narrow down the number. Probably we just need to show a list of numbers 0-9 in morse code for people to reference.
- ## **Reusable Components**
  -

#### Classified

- **Steps**
  - Codes - record 4x codes from different in-game locations -> present ordered list of codes
- ## **Reusable Components**
  -

#### Dead of the Night

- **Steps**
  - Atlas - user selects starting position of Atlas puzzle -> present order to interact with levers
  - Stake Knife (side-egg) - record symbol order from trees -> present ordered list
- **Reusable Components**
  - symbol picker the stake knife component would be very similar to the Planets step from Voyage of Despair except the picker would show symbols to select instead of just text or text & associated symbol

#### Ancient Evil

- ## **Steps**
- ## **Reusable Components**

#### Alpha Omega

- **Steps**
  - Operation Toy Solder - show location for each code and record code -> display ordered list of codes to enter
  - Rushmore Clocks - show list of 6 possible initial codes from tv (letter-number-number-number-number), user selects list -> display remaining codes (houses+times) known to us from knowing the initial code -> allow user to record code from last clock -> display code to enter into Rushmore
  - Rushmore Power - show 6 panels with their locations and whether lever should be UP/DOWN
- ## **Reusable Components**

#### Tag der Toten

- **Steps**
  - Hermit song - record the order of notes from in-game subtitles -> display ordered list of bells to hit and their respective locations
  - Apothican quotes - record in-game quote from a list of 20 -> show user location associated to quote. Repeat 3x then user selects quote from new list of 4 -> show user location associated to quote.
  - Orbs - 3x orbs to shoot each with 6 spawns, allow user to mark an orb and associated locations as done
- ## **Reusable Components**

### BO6

#### Terminus

- **Steps**
  - Nathan code -
  - Multiphasic Resonator code -
- ## **Reusable Components**
  -

#### Citadelle des Morts

- **Steps**
  - Trap Full - record symbols from Tavern bottles in order -> display symbols in ordered list for wall puzzle
  - Trap Skip - record trap order from pages in Stamina-up room -> show trap symbol order and allow users to add locations to the trap symbols
  - Void sword - pick the antiquity from a list -> present user with correct symbols to enter
  - Light sword - show order to enter symbols
- ## **Reusable Components**
  -

#### The Tomb

- **Steps**
  - Ice Staff upgrade - record symbol order -> display map of symbols to shoot on the portal with active irrelevant symbols grayed out
- ## **Reusable Components**
  -

#### Shattered Veil

- **Steps**
  - Chalkboard puzzle - user selects word from list of 4 -> user selects board from list of 4 -> display final code
- ## **Reusable Components**
  -
