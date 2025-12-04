import {LovelaceCard, LovelaceCardConfig, LovelaceCardEditor} from 'custom-card-helpers';

declare global {
    interface HTMLElementTagNameMap {
        'heat-flow-card-editor': LovelaceCardEditor;
        'hui-error-card': LovelaceCard;
    }
}

export interface HeatFlowConfig extends LovelaceCardConfig {
    heatingActive: string;
    waterHeatingActive: string;
    mixerPumpActive: string;
    burnerCurrentPower: string;
    gasHeaterTemp: string;
    boilerTankTemp: string;
    mixerFlowTemp: string;
    floorSupplyTemp: string;
    heatingFloorDailyLoad: string;
    boilerDailyLoad: string;
    gasHeaterDailyLoad: string;
    mixerValveLvl: string;
}
