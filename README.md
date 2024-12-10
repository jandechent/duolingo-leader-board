# duolingo-leader-board

While the integration [homeassistant-duolingo](https://github.com/Makhuta/homeassistant-duolingo) offers a good way to import the duolingo statistics, I had a need for a card rendering the board. You can find this here: 

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=jandechent&repository=duolingo-leader-board)

## Configuration

 - `username:` Expects the username you provided during setup of the above intergration. Also, please do not rename the entitiy_id, that the integration generated. 
 - `todayxp_goal:` Your XP goal. 
 - `maxrows:` Limits the number of rows shown. You will always be shown, even if you are at a lower rank. 

## CSS-Classes 

  -  `.pre` class for row with users with higher score
  - `.fill` class for filler row, if entries needed to be skipped
  - `.me`   class for row with your results
  - `.post` class for row with users with lower score
