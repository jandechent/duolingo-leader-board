# duolingo-leader-board

While https://github.com/Makhuta/homeassistant-duolingo offers a good way to import the duolingo statistics, I had a need for a card rendering the board. 

![image](https://github.com/user-attachments/assets/90e7e66c-5546-4aab-9ac5-92f119c4e450)



## Configuration
 - `entity`: Expects the one that the integration above creates as sensor.<username>_duolingo_leaderboard
 - `maxrows`: Limits the number of rows shown. You will always be shown, even if you are at a lower rank. 

## Install
Add this as custom repository to HACS

## Customization
  -  `.pre` class for row with users with higher score
  - `.fill` class for filler row, if entires needed to be skipped
  - `.me`   class for row with your results
  - `.post` class for row with users with lower score
I guess `card_mod` should allow you to further teak this. 
  
## For Daily Progress
This is what I use for daily progress, totally unrelated to this repository, but useful. 

![image](https://github.com/user-attachments/assets/13993c4b-43a6-4c1d-bd97-f423ba3c4f4c)


```
type: custom:plotly-graph
raw_plotly_config: true
hours_to_show: 1d
entities:
  - entity: sensor.falk0815_duolingo_today_xp
    type: bar
    fn: |-
      $fn ({ xs,ys,vars, meta}) => {
        vars.xs = [];
        vars.ys = [];      
        for (const [key, value] of Object.entries(meta)) {
          if (key.includes(".20")){
            vars.xs.unshift(key);
            vars.ys.unshift(value);
          }
        }
        vars.xs  = vars.xs.map(x=>x.split(".20")[0]+".");
        vars.max = Math.max(1.05*Math.max(...vars.ys),100);
      }        
    x: $ex vars.xs
    "y": $ex vars.ys
refresh_interval: 100
visibility:
  - condition: user
    users:
      - 76d2743b0aa842aca5ec39494e30b707
title: $ex "Daily XP"
layout:
  height: 250
  yaxis:
    rangemode: tozero
    mirror: true
    range:
      - 0
      - $ex vars.max;
  xaxis:
    mirror: true
  margin:
    l: 40
    b: 40
    t: 10
    r: 20
```
