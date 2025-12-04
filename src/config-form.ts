export function configForm() {
    return {
        schema: [
            {
                name: "heatingActive", required: true, selector: {entity: {}}
            },
            {
                name: "waterHeatingActive", required: true, selector: {entity: {}}
            },
            {
                name: "mixerPumpActive", required: true, selector: {entity: {}}
            },
            {
                name: "burnerCurrentPower", required: true, selector: {entity: {}}
            },
            {
                name: "gasHeaterTemp", required: true, selector: {entity: {}}
            },
            {
                name: "boilerTankTemp", required: true, selector: {entity: {}}
            },
            {
                name: "mixerFlowTemp", required: true, selector: {entity: {}}
            },
            {
                name: "floorSupplyTemp", required: true, selector: {entity: {}}
            },
            {
                name: "heatingFloorDailyLoad", required: true, selector: {entity: {}}
            },
            {
                name: "boilerDailyLoad", required: true, selector: {entity: {}}
            },
            {
                name: "gasHeaterDailyLoad", required: true, selector: {entity: {}}
            },
            {
                name: "mixerValveLvl", required: true, selector: {entity: {}}
            }
        ],
        assertConfig:
            (config) => {
                if (config.other_option) {
                    throw new Error("'other_option' is unexpected.");
                }
            },
    }
        ;
}