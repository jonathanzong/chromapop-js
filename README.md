chromapop-js
============

Javascript implementation of ChromaPop.

# Color Space

ChromaPop operates based on the [RGB color model](http://en.wikipedia.org/wiki/RGB_color_model).

__Red__, __Green__, and __Blue__ are considered *primary* colors.

__Cyan__, __Magenta__, and __Yellow__ are considered *secondary* colors.

__White__ is the sum of all three primary colors, or a *tertiary* color.

# Scoring

Clicking on part of a block of __3 or more continuously adjacent bubbles__ will result in a valid move.

- Clicking on a primary color will pop a block of that color, awarding __1 point__ for each bubble.
- Clicking on a non-primary will do one of the following:
  - If there is a valid block of that non-primary color, it will pop.
      - A __2x multiplier__ is awarded for secondary colors (CMY).
      - A __3x multiplier__ is awarded for the tertiary color (w).
  - If there are not at least 3 continuously adjacent bubbles of that same color, the bubble will __decompose into its primary components__.
      - A blocks of continuously adjacent bubbles to the original bubble of the same color as a primary component of that bubble will be popped.
      - For example: Clicking a *Magenta* bubble will pop a range of *Red* and *Blue* bubbles. The original bubble will be left as a primary bubble.
