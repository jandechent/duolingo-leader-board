class DuolingoLeaderBoardCard extends HTMLElement {


    // assumes, https://github.com/Makhuta/homeassistant-duolingo is installed. 

   

    config;
    content;

    setConfig(config) {
        if (!config.entity) {
            throw new Error('Please define entity!');
        }
        if (!config.maxrows | config.maxrows>30 | config.maxrows<3) {
            throw new Error('Please define row number between 3 and 30!');
        }        
        this.config = config;
    }

    set hass(hass) {
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const myrank = state ? state.state : 'unavailable';
        const myscore = state.attributes[myrank]["score"];
        const nexttext = (myrank>1)? `Next in ${state.attributes[myrank-1]["score"]-myscore+1} XPs`: '';

        let rows = [...Array(this.config.maxrows).keys()];
        rows=rows.map(r=>(r+1).toString());

        if (this.config.maxrows < myrank){
            rows[rows.length-2]="...";
            rows[rows.length-1]=myrank-1;
            rows[rows.length-0]=myrank;
        }

        // done once - so the card is not updating live
        if (!this.content) {
            // user makes sense here as every login gets it's own instance
            this.innerHTML = `
                <ha-card header="Rank ${myrank}! ${nexttext}">
                    <div class="card-content"></div>
                </ha-card>
            `;
            this.content = this.querySelector('div');

    
            let tab = `<table>`;
            tab += `<thead><tr><th>Rank</th><th>Name</th><th>Streak</th><th>Score</th><th>Ahead</th></tr></thead>`;
            tab += `<tbody>`;
    
            rows.forEach((i) => {
                if (i=="..."){
                    tab += `<tr class="fill">`;
                    tab += `<td colspan="100%"></td>`;
                    tab += `</tr>`;
                }else{
                    let cl = "me";
                    cl = (i < myrank) ? "pre" : cl;
                    cl = (i > myrank) ? "post" : cl;
    
                    tab += `<tr class="${cl}">`;
                    tab += `  <td>${i}</td>`;
                    tab += `  <td>${state.attributes[i]["display_name"]}</td>`;
                    tab += `  <td><ha-icon icon='${(state.attributes[i]["streak_extended_today"]==true)?"mdi:fire":"mdi:fire-off"}'></ha-icon></td>`;
                    tab += `  <td>${state.attributes[i]["score"]}</td>`;
                    tab += `  <td>${state.attributes[i]["score"] - myscore}</td>`;
                    tab += `</tr>`;
                }
            })
            tab += `</tbody></table>`;
    
            let css = `
                table { width:100%; white-space:nowrap; border-collapse:collapse; }
                
                td,th { border: 1px solid black; }
                tr:nth-child(even) { background-color:var(--table-row-alternative-background-color); }
                tr:nth-child(odd)  { background-color:var(--table-row-background-color);             }
                
                .pre  td {padding: 2px 6px; }
                .fill td {height:  7px;}
                .me   td {padding: 2px 6px; font-size:large   ; font-weight: bold;  }
                .post td {padding: 0px 6px; font-size: x-small; }            
                
                td {text-align:right; }
                td:nth-child(2) {text-align:left;}
                td:nth-child(3) {text-align:center;}
            `;

            this.content.innerHTML = `<style>`+css+`</style>` + tab;
            }
    }

    static getStubConfig() {
        // if default config is used, this should find it
        //res = {key: val for key, val in hass.states.items() if key.endswith("duolingo_leaderboard")};
        //find a way to search ... above not working...
        return {
            entity: "sensor.<username>_duolingo_leaderboard",
            maxrows: 10 }
    }

}

customElements.define('duolingo-leader-board', DuolingoLeaderBoardCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "duolingo-leader-board",
    name: "Duolingo Leader Board",
    description: "Show the Duolingo Leader Board as Card (needs HACS intergration https://github.com/Makhuta/homeassistant-duolingo)" 
});
