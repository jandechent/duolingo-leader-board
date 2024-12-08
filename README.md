# duolingo-leader-board

While https://github.com/Makhuta/homeassistant-duolingo offers a good way to import the duolingo statistics, I had a need for a card rendering the board. 

![grafik](https://github.com/user-attachments/assets/d6b6952c-21c5-46a2-b3fe-04e1d90f0224)




## Configuration
 - `username:` Expects the username you provided during setup of the above intergration. Also, please do not rename the entitiy_id, that the integration generated. 
 - `todayxp_goal:` Your XP goal. 
 - `maxrows:` Limits the number of rows shown. You will always be shown, even if you are at a lower rank. 

## Install
Add this as custom repository to HACS

## Customization
  -  `.pre` class for row with users with higher score
  - `.fill` class for filler row, if entires needed to be skipped
  - `.me`   class for row with your results
  - `.post` class for row with users with lower score

I guess `card_mod` should allow you to further teak this. 
