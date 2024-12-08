import "https://cdn.plot.ly/plotly-2.4.2.min.js";
class DuolingoLeaderBoardCard extends HTMLElement {
    config;
    content;
    setConfig(config) {

        if (config.todayxp_goal){
            if (isNaN(Number(config.todayxp_goal)) || (config.todayxp_goal<0)){
                throw new Error('"todayxp_goal" needs to be a positive integer');
            }
        }

        if (!config.maxrows | config.maxrows>30 | config.maxrows<3) {
            throw new Error('Please define "maxrows" between 3 and 30!');
        }

        this.config = config;
    }

    makeProgressGraph() {
        var plt = document.createElement("div");            
        plt.setAttribute("id","theplot");
        let xs = [];
        let ys = [];
        // extract attributes, that are valid dates/scores
        for (const [key, value] of Object.entries( this.todayxp.attributes)) {
          if (key.includes(".20")){ // to get rid of "friendly_name", etc...
            xs.push(key);
            ys.push(value);
          }
        }

        // convert date string to new Date
        xs = xs.map(x=>{
            let parts = (x.split('.')).map(Number);
            let date  = new Date(parts[2],parts[1]-1,parts[0]);
            return date;
        })
        
        // from today, go backwards and fill _filled with scores, or fill 0
        let xs_filled = [];
        let ys_filled = [];
        let checkdate = new Date((new Date()).setHours(0,0,0,0));
        for (let day = 0; day < 7; day++) {
            xs_filled.push(new Date(checkdate));
            let i = xs.findIndex((element) => element.valueOf() == checkdate.valueOf());
            if (i>=0){ ys_filled.push(ys[i])
            }else{     ys_filled.push(0)}
            checkdate.setDate(checkdate.getDate()-1);
        } 

        // copy back to xs
        xs_filled.reverse()
        ys_filled.reverse()
        xs = xs_filled
        ys = ys_filled

        // make nice xtick labels by modifying the input already
        xs = xs.map(x=> x.getDate()+"."+(x.getMonth()+1)+".")

        var data = [
            {x: xs, y: ys, type: 'bar',showlegend:false,  text: ys.map(String),},
            {x: xs, y: ys.map(y=>Math.max(0,this.config.todayxp_goal-y)), type: 'bar',showlegend:false,opacity:0.3}
        ];
        var layout = {
            autosize: false,
            width: 350, height: 200,
            barmode: 'stack',
            margin: {l: 25, r: 20, b: 20, t: 10 },
        };
        Plotly.newPlot(plt, data, layout, {staticPlot: true});                	
        return plt;
    }
    
    makeTable(){
        let rows = [...Array(this.config.maxrows).keys()];
        rows=rows.map(r=>(r+1).toString());
        if (this.config.maxrows < this.myrank){
            rows[rows.length-2]="...";
            rows[rows.length-1]=this.myrank-1;
            rows[rows.length-0]=this.myrank;
        }    

        let tab = `<table>`;
        tab += `<thead><tr><th>Rank</th><th>Name</th><th>Streak</th><th>Score</th><th>Ahead</th></tr></thead>`;
        tab += `<tbody>`;
        rows.forEach((i) => {
            if (i=="..."){ // the divider row, in case we need to cut out results to keep within maxrows. 
                tab += `<tr class="fill">`;
                tab += `<td colspan="100%"></td>`;
                tab += `</tr>`;
            }else{
                // set the class for the row, depending on the rank
                let cl = "me"; 
                cl = (i < this.myrank) ? "pre" : cl;
                cl = (i > this.myrank) ? "post" : cl;
                tab += `<tr class="${cl}">`;
                tab += `  <td>${i}</td>`;
                tab += `  <td>${this.leaderboard.attributes[i]["display_name"]}</td>`;
                tab += `  <td><ha-icon icon='${(this.leaderboard.attributes[i]["streak_extended_today"]==true)?"mdi:fire":"mdi:fire-off"}'></ha-icon></td>`;
                tab += `  <td>${this.leaderboard.attributes[i]["score"]}</td>`;
                tab += `  <td>${(i == this.myrank) ?"":(this.leaderboard.attributes[i]["score"] - this.myscore)}</td>`;
                tab += `</tr>`;
            }
        })
        tab += `</tbody></table>`;

        // I think im in a shadow dom, this css "should" not break anything else...
        let css = `
            table { width:100%; white-space:nowrap; border-collapse:collapse;}
            td,th { border: 1px solid black;}
            tr:nth-child(even) { background-color:var(--table-row-alternative-background-color);}
            tr:nth-child(odd)  { background-color:var(--table-row-background-color);}

            .pre  td {padding: 2px 6px;}
            .fill td {height:  7px;}
            .me   td {padding: 2px 6px; font-size: large; font-weight: bold;}
            .post td {padding: 0px 6px; font-size: x-small;}

            td {text-align:right;}
            td:nth-child(2) {text-align:left;}
            td:nth-child(3) {text-align:center;}
        `;
        const template = document.createElement('template');
        template.innerHTML = `<style>`+css+`</style>` + tab;

        return template.content;
    }

    set hass(hass) {
        // done once - so the card is not updating live
        if (!this.content) {
            try {
                this.leaderboard = hass.states["sensor."+this.config.username+"_duolingo_leaderboard"];
                this.todayxp = hass.states["sensor."+this.config.username+"_duolingo_today_xp"];
                
                this.myrank       = this.leaderboard.state;
                this.myscore      = this.leaderboard.attributes[this.myrank]["score"];
                this.nexttext     = (this.myrank>1)? `Next in ${this.leaderboard.attributes[this.myrank-1]["score"]-this.myscore+1} XPs`: "";
                this.todayxp_goal = hass.states[this.config.todayxp_goal]
            }catch(error){
                throw new Error('Check what username you provided and that you have not renamed the entity_id from the integration.');
            }

            // basic card header and layout
            this.innerHTML  = `<ha-card header="Rank ${this.myrank}! ${this.nexttext}"><div class="card-content"></div></ha-card>`;

            // card content itself:
            this.content    = this.querySelector('div');
            this.content.append(this.makeTable());
            
            this.content.append(this.makeProgressGraph());

        }
    }

    static getStubConfig() { return {

        username:           "duolingo username",
        todayxp_goal:       50,
        maxrows:            10
    }}

}
customElements.define('duolingo-leader-board', DuolingoLeaderBoardCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "duolingo-leader-board",
    name: "Duolingo Leader Board",
    description: "Show the Duolingo Leader Board as Card (needs HACS intergration https://github.com/Makhuta/homeassistant-duolingo)" 
});
