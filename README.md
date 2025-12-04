# Home Assistant Lovelace Card for the "heat flow" service

Inspired by [sunsync-power-flow-card](https://slipx06.github.io/sunsynk-power-flow-card/index.html)

Here's what it looks like:

![Image](card_pic.png)

## Installation

* Copy the file dist/heat-flow-card to config/www/heat-flow-card/
* Go to Settings->Dashboards->Resources and add "/local/heat-flow-card/heat-flow-card.js" with type "JavaScript Module"
* Go back to a dashboard and add the "Custom: HeatFlow Card" card

Default configuration:

This card uses entities provided by [EMS-ESP](https://emsesp.org/)

[EMS-ESP github](https://github.com/emsesp)

```yaml
type: 'custom:heat-flow-card'
heatingActive: binary_sensor.boiler_heating_active
waterHeatingActive: binary_sensor.boiler_dhw_3_way_valve_active
mixerPumpActive: switch.mixer_hc1_pump_status_pc1
burnerCurrentPower: sensor.boiler_burner_current_power
gasHeaterTemp: sensor.boiler_current_flow_temperature
boilerTankTemp: sensor.boiler_dhw_storage_extern_temperature
mixerFlowTemp: sensor.boiler_mixing_switch_temperature
floorSupplyTemp: sensor.mixer_hc1_flow_temperature_tc1
heatingFloorDailyLoad: sensor.esp_heat_floor_daily_energy_usage
boilerDailyLoad: sensor.esp_hwboiler_daily_energy_usage
gasHeaterDailyLoad: sensor.esp_total_daily_energy_usage
mixerValveLvl: sensor.mixer_hc1_mixing_valve_actuator_vc1

```

Additional sensors for daily energy spent
```yaml
utility_meter:
  esp_heating:
    name: "Daily Heating Energy"
    source: sensor.boiler_energy_heating
    periodically_resetting: false
    unique_id: sensor.esp_heat_floor_daily_energy_usage
    always_available: true
    cycle: daily
  esp_boiler:
    name: "Daily Hot Water Energy"
    source: sensor.boiler_dhw_energy
    periodically_resetting: false
    unique_id: sensor.esp_hwboiler_daily_energy_usage
    always_available: true
    cycle: daily
  esp_gas:
    name: "Daily Total Energy"
    source: sensor.boiler_total_energy
    periodically_resetting: false
    unique_id: sensor.esp_total_daily_energy_usage
    always_available: true
    cycle: daily

```

For Devs:
install yarn, then run yarn install to install dependencies and yarn build to regenerate the JS file in the dist directory.