# duolingo-leader-board

While https://github.com/Makhuta/homeassistant-duolingo offer a good way to import the duolingo statistics, I had a need for a card rendering the board. 

## Configuration
 - as entity it expectd the one that integration above creates as sensor.<username>_duolingo_leaderboard
 - user maxrows to limit the number of rows shown. You will always be shown, even if you are at a lower rank. 

## Install
Add this as custom repository to HACS

## Customization
 -  .pre class for row with users with higher score
  - .fill class for filler row, if entires needed to be skipped
  - .me   class for row with your results
  - .post class for row with users with lower score
            
