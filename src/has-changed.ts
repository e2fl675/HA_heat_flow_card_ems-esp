import {PropertyValues} from "lit-element";
import {HomeAssistant} from "custom-card-helpers";

export function hasChanged(element: any, changedProps: PropertyValues): boolean {
    // Force update after any config change
    if (changedProps.has('config')) {
        return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass && element.config && oldHass.states && element.hass.states) {
        const config = element.config;
        const oldState = oldHass.states;
        const newState = element.hass.states;
        return (config.waterHeatingActive && oldState[config.waterHeatingActive] !== newState[config.waterHeatingActive]) ||
            (config.mixerPumpActive && oldState[config.mixerPumpActive] !== newState[config.mixerPumpActive]) ||
            (config.heatingActive && oldState[config.heatingActive] !== newState[config.heatingActive]) ||
            (config.burnerCurrentPower && oldState[config.burnerCurrentPower] !== newState[config.burnerCurrentPower]) ||
            (config.gasHeaterTemp && oldState[config.gasHeaterTemp] !== newState[config.gasHeaterTemp]) ||
            (config.boilerTankTemp && oldState[config.boilerTankTemp] !== newState[config.boilerTankTemp]) ||
            (config.mixerFlowTemp && oldState[config.mixerFlowTemp] !== newState[config.mixerFlowTemp]) ||
            (config.floorSupplyTemp && oldState[config.floorSupplyTemp] !== newState[config.floorSupplyTemp]) ||
            (config.heatingFloorDailyLoad && oldState[config.heatingFloorDailyLoad] !== newState[config.heatingFloorDailyLoad]) ||
            (config.boilerDailyLoad && oldState[config.boilerDailyLoad] !== newState[config.boilerDailyLoad]) ||
            (config.gasHeaterDailyLoad && oldState[config.gasHeaterDailyLoad] !== newState[config.gasHeaterDailyLoad]) ||
            (config.mixerValveLvl && oldState[config.mixerValveLvl] !== newState[config.mixerValveLvl]);
    }
    return false;
}
