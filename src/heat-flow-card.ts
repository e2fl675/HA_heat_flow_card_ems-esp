import {css, html, LitElement, PropertyValues, TemplateResult} from 'lit';

import {customElement, property, state} from 'lit/decorators.js';

import {fireEvent, HomeAssistant} from 'custom-card-helpers';

import type {HeatFlowConfig} from './types';
import {CARD_VERSION} from './const';
import {hasChanged} from "./has-changed";
import {configForm} from "./config-form";

console.info(
    `%c  HeatFlow Card \n%c  Version ${CARD_VERSION} `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'heat-flow-card',
    name: 'HeatFlow Card',
    description: 'A template custom card for you to create something awesome',
});

@customElement('heat-flow-card')
export class HeatFlowCard extends LitElement {

    // https://lit-element.polymer-project.org/guide/properties
    // https://lit-element.polymer-project.org/guide/properties
    @property({attribute: false})
    public hass!: HomeAssistant;
    @state()
    private config!: HeatFlowConfig;

    // https://lit-element.polymer-project.org/guide/properties#accessors-custom
    public setConfig(config: HeatFlowConfig): void {
        // TODO Check for required fields and that they are of the proper format
        if (!config) {
            throw new Error("Invalid configuration");
        }
        this.config = config;
    }

    // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
    protected shouldUpdate(changedProps: PropertyValues): boolean {
        if (!this.config) {
            return false;
        }

        return hasChanged(this, changedProps);
    }

    static styles = css`
        ha-card {
            height: 100%;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            text-align: center;
            --name-font-size: 1.2rem;
            --brightness-font-size: 1.2rem;
        }

        .st3 {
            font-size: 9px;
        }

        .st10 {
            font-size: 16px;
        }

        .left-align {
            text-anchor: start;
        }

        text {
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .boiler-flow path {
            stroke: #dc3545;
        }

        .boiler-flow circle {
            fill: #dc3545;
        }

        .boiler-flow rect {
            fill: none;
            stroke: #5FB6AD;
        }

        .boiler-flow text {
            fill: #5FB6AD;
        }

        .heating-flow path {
            stroke: #dc3545;
        }

        .heating-flow circle {
            fill: #dc3545;
        }

        .heating-flow rect {
            fill: none;
            stroke: #FFC0CB;
        }

        .heating-flow text {
            fill: #FFC0CB;
        }

        .heating-flow svg {
            fill: #FFC0CB;
        }

        .gas {
            fill: #f5e5c1;
        }

        .gas rect {
            fill: none;
            stroke: #f5e5c1;
        }

        .gas #flame.flame-active {
            fill: #dc3545;
        }
        .gas #flame.flame-inactive {
            fill: #f5e5c1;
        }

    `;

    render(): TemplateResult {

        const whActive = this.hass.states[this.config.waterHeatingActive].state.toLowerCase() === 'on';
        const heatingActive = this.hass.states[this.config.heatingActive].state.toLowerCase() === 'on';
        const mixerPumpActive = this.hass.states[this.config.mixerPumpActive].state.toLowerCase() === 'on';
        const flameWorks = whActive || heatingActive;

        return html`
            <ha-card>
                <div class="content">
                    <div>
                        <svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
                             viewBox="-2 0 490 408" height="100%" width="100%">

                            <svg class="boiler-flow" style="overflow: visible" >

                                <svg x="30" y="242" width="175" height="140" viewBox="0 0 160 30"
                                     preserveAspectRatio="xMidYMid meet">

                                    <rect x="50" y="0" width="70" height="30" rx="4.5" ry="4.5" pointer-events="all"/>
                                    <a href="#" @click=${this._handleBoilerFlowTempClick}>
                                        <text id="boiler_flow_temp" x="85" y="16" ">
                                            ${ whActive ? this.hass.states[this.config.gasHeaterTemp].state + " °C" : "---" }
                                        </text>
                                    </a>

                                    <path fill="none" stroke-miterlimit="10" pointer-events="stroke" id="boiler-line1" d="M5 -45 l0 50 q0 10 10 10 l35 0"/>
                                    <circle cx="0" cy="0" r="3" display="${ whActive ? "" : "none" }">
                                        <animateMotion repeatCount="indefinite" keyTimes="0;1" calcMode="linear" dur="7s" keyPoints="0;1">
                                            <mpath href="#boiler-line1" />
                                        </animateMotion>
                                    </circle>

                                    <path fill="none" stroke-miterlimit="10" pointer-events="stroke" id="boiler-line" d="M 120 15 l45 0"/>
                                    <circle cx="0" cy="0" r="3" display="${ whActive ? "" : "none" }">
                                        <animateMotion repeatCount="indefinite" keyTimes="0;1" calcMode="linear" dur="4s" keyPoints="0;1">
                                            <mpath href="#boiler-line" />
                                        </animateMotion>
                                    </circle>
                                </svg>

                                <svg id="water_boiler" x="195" y="275" width="75" height="75" viewBox="0 0 300 300"
                                     preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <linearGradient id="boiler_grad" x1="0%" x2="0%" y1="0%" y2="100%">
                                            <stop offset="30%" stop-color="#5490C2"/> <!-- blue  -->
                                            <stop offset="70%" stop-color="#dc3545"/> <!-- red  -->
                                        </linearGradient>
                                    </defs>
                                    <g transform="translate(0,300) scale(0.05,-0.05)" stroke="none">
                                        <path fill="url(#boiler_grad)"
                                              d="M2230 5869 c-623 -68 -970 -192 -1058 -378 -55 -116 -48 -4355 7 -4445 52 -84 179 -175 302 -216 55 -18 100 -39 101 -47 1 -7 4 -63 6 -125 8 -217 129 -321 462 -398 732 -167 1945 -97 2243 131 90 68 112 116 126 267 7 85 21 133 41 143 17 8 91 44 165 78 95 45 150 86 185 137 l50 73 0 2177 c0 2401 9 2239 -127 2343 -309 235 -1551 365 -2503 260z m1430 -311 c401 -37 784 -125 847 -195 31 -33 33 -199 28 -2105 l-5 -2068 -76 -37 c-500 -244 -2325 -253 -2883 -13 -117 50 -108 -122 -110 2148 l-1 2051 45 30 c270 176 1311 268 2155 189z m-1410 -4882 c270 -38 1296 -31 1589 10 240 35 300 25 237 -38 -230 -231 -2238 -191 -2148 43 9 25 28 31 77 22 36 -6 146 -23 245 -37z"/>
                                        <path fill="#5490C2"
                                              d="M2967 5287 c-64 -26 -353 -509 -362 -606 -47 -482 599 -670 797 -232 78 172 50 284 -143 574 -181 272 -210 298 -292 264z m178 -454 c139 -214 121 -355 -55 -413 -253 -83 -365 153 -198 415 116 181 134 181 253 -2z"/>
                                        <path fill="#dc3545"
                                              d="M1500 3179 l0 -112 225 -24 c351 -38 425 -64 265 -94 -160 -30 -106 -58 170 -89 105 -12 240 -29 300 -39 130 -20 619 36 669 78 40 33 40 129 0 162 -17 14 -199 47 -405 74 -206 26 -565 73 -799 102 l-425 55 0 -113z"/>
                                        <path fill="#dc3545"
                                              d="M1656 2795 c-104 -81 -40 -183 127 -204 244 -30 277 -36 277 -53 0 -9 -25 -23 -55 -29 -176 -39 -131 -58 245 -107 312 -40 664 -28 856 30 77 24 76 208 -1 208 -31 0 -984 122 -1178 150 -244 36 -232 36 -271 5z"/>
                                        <path fill="#dc3545"
                                              d="M1630 2313 c-70 -107 0 -155 270 -184 209 -23 221 -40 52 -78 -156 -35 258 -115 608 -118 454 -3 652 61 601 194 -24 64 3 58 -671 145 -816 105 -818 105 -860 41z"/>
                                        <path fill="#dc3545"
                                              d="M1629 1871 c-65 -99 9 -159 223 -180 284 -29 256 -62 -89 -105 l-263 -33 0 -106 c0 -72 8 -107 25 -107 14 0 236 28 495 61 259 33 578 74 710 89 415 49 430 55 430 152 0 77 -59 111 -220 127 -134 14 -349 41 -865 111 -383 52 -407 51 -446 -9z"/>
                                    </g>
                                </svg>
                                
                                <a href="#" @click=${this._handleBoilerLoadClick}>
                                    <text id="boiler_load_value" x="205" y="365" class="st10 left-align"> 
                                        ${this.hass.states[this.config.boilerDailyLoad].state}
                                         kWh
                                    </text>
                                    <text x="205" y="380" class="st3 left-align"> DAILY ENERGY</text>
                                </a>

                                <a href="#" @click=${this._handleBoilerWaterTempClick}>
                                    <text id="boiler_water_temp" x="265" y="305" class="st10 left-align">
                                        ${this.hass.states[this.config.boilerTankTemp].state}
                                         °C
                                    </text>
                                    <text x="265" y="320" class="st3 left-align"> WATER TEMPERATURE</text>
                                </a>

                            </svg>

                            <svg class="heating-flow" style="overflow: visible" x="0%">

                                <svg x="30" y="50" width="175" height="140" viewBox="0 0 160 30" preserveAspectRatio="xMidYMid meet">
                                    <rect x="50" y="0" width="70" height="30" rx="4.5" ry="4.5" fill="none" pointer-events="all"/>
                                    <a href="#" @click=${this._handleMixerFlowTempClick}>
                                        <text id="mixer_flow_temp" x="85" y="16">
                                            ${ heatingActive ? this.hass.states[this.config.gasHeaterTemp].state + " °C" : "---" }                                            
                                        </text>
                                    </a>

                                    <path fill="none" stroke-miterlimit="10" pointer-events="stroke" id="mixer-line1" d="M5 75 l0-50 q0-10 10 -10 l35 0"/>
                                    <circle cx="0" cy="0" r="3" display="${ heatingActive ? "" : "none" }" >
                                        <animateMotion repeatCount="indefinite" keyTimes="0;1" calcMode="linear" dur="7s" keyPoints="0;1">
                                            <mpath href="#mixer-line1" />
                                        </animateMotion>
                                    </circle>

                                    <path fill="none" stroke-miterlimit="10" pointer-events="stroke" id="mixer-line" d="M 120 15 l45 0"/>
                                    <circle cx="0" cy="0" r="3" display="${ heatingActive ? "" : "none" }" >
                                        <animateMotion repeatCount="indefinite" keyTimes="0;1" calcMode="linear" dur="4s" keyPoints="0;1">
                                            <mpath href="#mixer-line" />
                                        </animateMotion>
                                    </circle>
                                </svg>

                                <svg id="mixer" x="200" y="90" width="75" height="60" viewBox="0 0 900 969"
                                     preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0,969) scale(0.1,-0.1)" stroke="none">
                                        <path d="M435 9621 c-142 -25 -283 -155 -336 -308 -19 -55 -19 -144 -19 -4468
                                            0 -4389 0 -4412 20 -4470 30 -86 62 -136 128 -196 61 -56 114 -87 192 -110 67
                                            -21 2111 -21 2185 0 161 44 288 171 330 331 22 83 23 8800 0 8885 -34 131
                                            -128 243 -254 304 l-76 36 -1065 1 c-586 1 -1083 -1 -1105 -5z"/>
                                        <path d="M8210 8445 c-30 -13 -131 -54 -225 -90 -93 -36 -184 -73 -202 -81
                                            -17 -8 -36 -14 -42 -14 -6 0 -19 -4 -29 -9 -35 -19 -85 -41 -95 -41 -8 0 -27
                                            -7 -112 -45 -64 -28 -188 -78 -385 -155 -113 -45 -215 -85 -228 -90 -42 -18
                                            -57 -10 -137 74 -127 133 -232 205 -380 262 -120 45 -226 64 -368 64 -302 0
                                            -540 -106 -755 -336 -44 -46 -85 -84 -92 -84 -14 0 -438 167 -595 235 -16 7
                                            -46 20 -65 28 -19 8 -55 23 -80 32 -46 18 -100 40 -135 55 -11 5 -49 20 -85
                                            33 -36 14 -134 53 -219 86 -84 34 -157 61 -162 61 -5 0 -10 -180 -11 -407 l-3
                                            -408 -342 -3 -343 -2 -1 -375 c-1 -206 -2 -381 -3 -387 -1 -10 74 -14 338 -16
                                            257 -2 342 -5 348 -15 4 -6 8 -193 8 -414 0 -432 -1 -420 48 -393 9 5 33 15
                                            52 23 19 8 49 20 65 27 60 24 273 110 400 159 72 29 139 55 150 60 11 5 45 19
                                            75 31 30 11 64 25 75 30 314 132 586 240 606 240 8 0 35 -17 60 -37 25 -21 68
                                            -54 97 -73 39 -27 52 -41 52 -61 0 -23 -23 -88 -100 -276 -17 -40 -44 -108
                                            -61 -150 -17 -43 -35 -87 -40 -98 -36 -88 -48 -116 -64 -155 -10 -25 -23 -58
                                            -30 -75 -16 -38 -75 -189 -110 -280 -23 -61 -71 -180 -96 -240 -37 -89 -48
                                            -116 -63 -155 -17 -41 -25 -60 -54 -130 -20 -45 -42 -102 -42 -106 0 -2 184
                                            -4 409 -4 226 0 412 -3 414 -7 3 -5 8 -566 12 -1249 7 -1055 6 -1242 -6 -1250
                                            -8 -5 -545 -9 -1264 -10 l-1250 0 0 -345 0 -344 2855 0 2855 0 3 341 2 342
                                            -37 3 c-21 2 -557 4 -1191 3 -902 0 -1155 2 -1163 12 -7 8 -12 429 -16 1249
                                            -5 1059 -4 1238 8 1246 8 5 190 9 406 9 259 0 394 4 398 10 6 9 -29 106 -65
                                            185 -5 11 -19 45 -30 75 -12 30 -28 71 -36 90 -9 19 -19 44 -24 55 -4 11 -32
                                            76 -60 145 -29 69 -93 226 -142 350 -49 124 -94 236 -99 250 -30 70 -38 89
                                            -54 130 -9 25 -23 59 -30 75 -8 17 -20 46 -28 65 -8 19 -35 85 -61 145 -52
                                            124 -56 156 -23 177 12 9 52 43 90 77 37 33 72 61 79 61 13 0 279 -104 433
                                            -170 11 -5 76 -32 145 -60 69 -29 139 -58 155 -65 17 -8 48 -21 70 -30 22 -9
                                            49 -20 60 -25 11 -5 45 -19 75 -30 30 -11 64 -25 75 -30 11 -5 85 -34 165 -66
                                            80 -31 149 -60 155 -65 5 -5 15 -9 22 -9 7 0 36 -11 64 -25 29 -13 56 -22 60
                                            -19 5 3 9 182 9 399 0 344 2 396 16 409 13 14 56 16 313 16 l298 0 6 248 c11
                                            415 10 519 -9 526 -9 3 -150 6 -315 6 l-299 0 -6 26 c-4 15 -4 133 0 263 9
                                            347 9 535 0 537 -5 2 -34 -8 -64 -21z"/>
                                    </g>
                                </svg>

                                <svg x="270" y="100" width="160" height="40" viewBox="0 0 150 30" preserveAspectRatio="xMidYMid meet">
                                    <rect x="35" y="0" width="70" height="30" rx="4.5" ry="4.5" fill="none" pointer-events="all"/>
                                    <a href="#" @click=${this._handleFloorFlowTempClick}>
                                        <text id="heating_floor_temp" x="70" y="16">                                             
                                            ${this.hass.states[this.config.floorSupplyTemp].state}
                                            °C
                                        </text>
                                    </a>
                                    <path fill="none" stroke-miterlimit="10" pointer-events="stroke" id="heating-line" d="M 105 15 l 35 0"/>
                                    <circle cx="0" cy="0" r="3" display="${ mixerPumpActive ? "" : "none" }" >
                                        <animateMotion repeatCount="indefinite" keyTimes="0;1" calcMode="linear" dur="4s" keyPoints="0;1">
                                            <mpath href="#heating-line" />
                                        </animateMotion>
                                    </circle>
                                    <path fill="none" stroke-miterlimit="10" pointer-events="stroke" id="heating-line1" d="M0 15 l 35 0"/>
                                    <circle cx="0" cy="0" r="3" display="${ mixerPumpActive ? "" : "none" }" >
                                        <animateMotion repeatCount="indefinite" keyTimes="0;1" calcMode="linear" dur="4s" keyPoints="0;1">
                                            <mpath href="#heating-line1" />
                                        </animateMotion>
                                     </circle>
                                </svg>

                                <svg id="heating_floor" x="412" y="85" width="75" height="75" viewBox="0 0 900 756"
                                     preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0.0,756.0) scale(0.1,-0.1)" stroke="none">
                                        <path d="M1355 6883 c-78 -17 -150 -36 -164 -43 -9 -5 -38 -19 -66 -31 -80
                                            -35 -146 -81 -221 -155 -79 -78 -115 -129 -163 -229 -19 -38 -38 -78 -43 -88
                                            -10 -20 -22 -76 -39 -177 -23 -132 5 -306 74 -460 102 -230 349 -420 602 -463
                                            38 -6 609 -12 1551 -16 l1491 -6 36 -28 c73 -55 97 -153 58 -230 -26 -50 -39
                                            -65 -75 -85 -29 -16 -150 -17 -1536 -22 -1410 -5 -1509 -6 -1570 -23 -283 -78
                                            -507 -282 -589 -535 -60 -185 -64 -297 -21 -507 6 -27 15 -54 20 -59 6 -6 10
                                            -16 10 -23 0 -30 66 -150 121 -218 115 -145 282 -252 460 -295 85 -20 110 -20
                                            1568 -20 1345 0 1485 -1 1514 -16 141 -71 155 -230 29 -319 l-44 -30 -1511 -6
                                            c-1503 -5 -1561 -6 -1632 -38 -11 -5 -40 -17 -65 -27 -109 -44 -262 -164 -334
                                            -263 -160 -219 -207 -524 -119 -781 92 -267 300 -462 574 -539 l75 -21 2025 2
                                            2024 3 0 310 0 310 -1975 5 c-1950 5 -1975 5 -2014 25 -22 11 -53 37 -70 58
                                            -29 36 -31 44 -31 120 0 94 17 128 83 169 l37 23 1505 6 c957 3 1521 9 1550
                                            16 70 15 128 38 220 84 67 34 103 61 175 134 49 50 95 97 100 105 44 62 88
                                            150 116 230 31 92 32 100 32 255 0 123 -4 170 -16 205 -9 25 -17 51 -17 57 0
                                            19 -59 140 -93 192 -17 25 -64 81 -106 124 -110 113 -216 174 -401 230 -24 8
                                            -517 13 -1545 16 -1440 6 -1512 7 -1547 24 -20 11 -50 35 -65 55 -25 34 -28
                                            45 -28 119 0 75 2 84 30 118 17 21 46 46 65 56 33 18 91 19 1481 19 1522 0
                                            1556 1 1685 45 213 72 393 233 486 435 65 138 73 178 72 355 0 139 -3 170 -23
                                            234 -13 40 -30 85 -37 100 -8 14 -14 30 -14 34 0 5 -21 41 -46 80 -110 172
                                            -274 295 -479 359 l-70 22 -1515 6 c-1418 5 -1517 6 -1547 22 -52 29 -86 82
                                            -91 143 -9 104 46 184 139 204 35 8 754 11 2324 11 l2275 0 5 23 c3 12 4 155
                                            3 317 l-3 295 -2335 1 c-1284 1 -2344 0 -2355 -3z"/>
                                        <path d="M6773 6010 c-249 -53 -441 -221 -525 -461 l-23 -64 -5 -1222 -5
                                            -1222 -69 -68 c-114 -110 -183 -213 -257 -378 -54 -122 -87 -350 -70 -487 31
                                            -244 84 -380 218 -559 153 -204 340 -325 618 -400 68 -19 402 -19 465 -1 25 7
                                            70 20 100 29 197 58 391 196 523 372 137 182 204 362 222 594 10 127 -25 341
                                            -74 452 -74 164 -150 278 -260 383 l-66 63 -5 1222 c-5 1217 -5 1222 -26 1282
                                            -101 282 -336 460 -619 471 -55 2 -119 -1 -142 -6z m247 -277 c57 -21 139 -74
                                            173 -112 47 -53 86 -134 96 -201 7 -43 11 -484 11 -1286 l0 -1221 91 -77 c211
                                            -180 309 -383 309 -641 0 -312 -185 -602 -469 -732 -128 -58 -175 -68 -341
                                            -68 -168 0 -221 11 -347 72 -186 89 -340 256 -411 443 -80 214 -69 440 32 650
                                            51 107 138 208 269 313 l47 38 0 1234 c0 856 3 1250 11 1287 12 58 55 142 97
                                            189 32 37 109 88 166 110 57 23 206 24 266 2z"/>
                                        <path d="M6685 4782 c-3 -3 -5 -474 -5 -1047 0 -980 -1 -1043 -17 -1056 -10
                                            -8 -31 -21 -48 -29 -16 -8 -62 -46 -101 -85 -106 -107 -158 -229 -159 -375 0
                                            -143 53 -269 159 -376 82 -82 161 -124 277 -149 93 -19 121 -19 206 0 168 39
                                            293 134 366 279 87 171 85 336 -4 505 -37 69 -150 184 -204 206 -17 8 -37 20
                                            -43 28 -9 10 -13 281 -14 1057 l-3 1044 -202 2 c-111 1 -205 -1 -208 -4z"/>
                                        <path d="M5609 4971 c-46 -15 -77 -42 -105 -88 -23 -39 -26 -54 -22 -109 5
                                            -76 39 -126 109 -161 97 -49 207 -9 258 93 43 86 15 182 -71 247 -28 21 -127
                                            32 -169 18z"/>
                                        <path d="M5581 4178 c-28 -14 -54 -38 -73 -67 -26 -41 -29 -53 -26 -113 3 -56
                                            8 -73 34 -105 37 -47 106 -82 159 -82 57 0 124 37 159 88 113 167 -70 370
                                            -253 279z"/>
                                        <path d="M5609 3410 c-45 -13 -77 -40 -105 -87 -23 -39 -26 -54 -22 -109 3
                                            -52 9 -70 34 -101 57 -71 152 -100 225 -68 138 59 170 216 66 323 -45 47 -126
                                            64 -198 42z"/>
                                </svg>

                                <a href="#" @click=${this._handleFloorLoadClick}>
                                    <text id="heating_daily_power" x="430" y="80" class="st10 right-align">
                                        ${this.hass.states[this.config.heatingFloorDailyLoad].state}
                                         kWh
                                    </text>
                                    <text x="448" y="63" class="st3 right-align"> DAILY ENERGY</text>
                                </a>

                                <a href="#" @click=${this._handleMixerLvlClick}>
                                    <text id="mixer_lvl" x="205" y="80" class="st10 left-align">
                                        ${this.hass.states[this.config.mixerValveLvl].state}
                                         %
                                    </text>
                                    <text x="205" y="63" class="st3 left-align"> VALVE LEVEL</text>
                                </a>

                                <a href="#" @click=${this._handleMixerTempClick}>
                                    <text id="mixer_temp" x="205" y="45" class="st10 left-align">
                                        ${this.hass.states[this.config.mixerFlowTemp].state}
                                         °C
                                    </text>
                                    <text x="205" y="30" class="st3 left-align"> MIXER TEMP</text>
                                </a>

                            </svg>

                            <svg class="gas" style="overflow: visible" x="0%">

                                <svg id="gas_boiler" x="5.5" y="175" width="60" height="80" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" opacity="1">
                                    <defs>
                                        <svg id="flame" preserveAspectRatio="xMidYMid meet" overflow="visible" viewBox="0 0 80 80" 
                                             class="${flameWorks? "flame-active": "flame-inactive"}" >
                                            <g>
                                                <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z">
                                                </path>
                                            </g>
                                        </svg>
                                    </defs>
                                    <g>
                                        <path d="M9.5,0v46v12.567 c0,0.79,0.643,1.433,1.433,1.433 h38.135 c0.79,0,1.433-0.643,1.433-1.433 V46 V0 H9.5z 
                                              M51.5,56 h-37 V48 h31 V56z 
                                              M14.5,46 V4 h31 v39 H11.5z"/>
                                        <path d="M16.5,7 h5 c0.553,0,1,-0.447,1,-1 s-0.447-1-1-1 h-5 c-0.553,0,-1,0.447-1,1 s0.447,1,1,1z"/>
                                        <path d="M15.5,55 h10 v-6 h-10 v6 z"/>
                                        <path d="M26.5,55 h10 v-6 h-10 v6 z"/>
                                        <circle cx="41" cy="52" r="2"/>
                                        <use x="21" y="22" href="#flame"/>
                                    </g>
                                </svg>

                                <a href="#" @click=${this._handleGasHeaterDailyLoadClick}>
                                    <text id="gas_daily_power" x="75" y="190"  class="st10 left-align">
                                        ${this.hass.states[this.config.gasHeaterDailyLoad].state}
                                        kWh
                                    </text>
                                    <text x="75" y="205" class="st3 left-align"> DAILY ENERGY</text>
                                </a>
                                
                                <a href="#" @click=${this._handleBurnerPowerClick}>
                                    <text id="burner_power" x="75" y="225"  class="st10 left-align">
                                        ${this.hass.states[this.config.burnerCurrentPower].state}
                                         %
                                    </text>
                                    <text x="75" y="240" class="st3 left-align"> BURNER POWER</text>
                                </a>
                            </svg>
                        </svg>
                        
                    </div>
                </div>
            </ha-card>
        `;
    }

    _handleBoilerFlowTempClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.gasHeaterTemp,
        });
    }

    _handleBoilerLoadClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.boilerDailyLoad,
        });
    }

    _handleBoilerWaterTempClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.boilerTankTemp,
        });
    }

    _handleMixerFlowTempClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.gasHeaterTemp,
        });
    }

    _handleFloorFlowTempClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.floorSupplyTemp,
        });
    }

    _handleFloorLoadClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.heatingFloorDailyLoad,
        });
    }

    _handleMixerLvlClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.mixerValveLvl,
        });
    }

    _handleMixerTempClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.mixerFlowTemp,
        });
    }

    _handleGasHeaterDailyLoadClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.gasHeaterDailyLoad,
        });
    }

    _handleBurnerPowerClick(): void {
        fireEvent(this, "hass-more-info", {
            entityId: this.config.burnerCurrentPower,
        });
    }


    getCardSize(): number {
        return 6;
    }

    static getConfigForm() {
        return configForm();
    }
}
