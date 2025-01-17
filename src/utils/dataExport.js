const moment = require('moment');

/**
 * Exports data to HL7 v2.x format
 * @param {Object} data - The medical calculation data
 * @returns {string} HL7 message
 */
function exportToHL7(data) {
    const currentDateTime = moment().format('YYYYMMDDHHmmss');
    
    // MSH segment (Message Header)
    let hl7Message = `MSH|^~\\&|MEDICALCALC|HOSPITAL|RECEIVER|FACILITY|${currentDateTime}||ORU^R01|${Math.random().toString(36).substring(2, 15)}|P|2.5.1\r`;
    
    // PID segment (Patient Information)
    hl7Message += `PID|1||${data.patientId || ''}||||||||||||||||||||||||||||\r`;
    
    // OBR segment (Observation Request)
    hl7Message += `OBR|1|${data.orderId || ''}||CALC^Medical Calculator^LOCAL||${currentDateTime}|${currentDateTime}|||||||||||||||||||F\r`;
    
    // OBX segments (Observation/Result)
    Object.entries(data.results || {}).forEach(([key, value], index) => {
        hl7Message += `OBX|${index + 1}|NM|${key}^${key}^LOCAL||${value}||||||||${currentDateTime}\r`;
    });

    return hl7Message;
}

/**
 * Exports data to FHIR R4 format
 * @param {Object} data - The medical calculation data
 * @returns {Object} FHIR resource
 */
function exportToFHIR(data) {
    const currentDateTime = new Date().toISOString();
    
    // Create FHIR Observation resource
    const fhirResource = {
        resourceType: "Observation",
        status: "final",
        category: [{
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "laboratory",
                display: "Laboratory"
            }]
        }],
        code: {
            coding: [{
                system: "http://loinc.org",
                code: "score",
                display: "Medical Calculator Score"
            }]
        },
        effectiveDateTime: currentDateTime,
        issued: currentDateTime,
        valueQuantity: {
            value: data.score,
            unit: "score",
            system: "http://unitsofmeasure.org",
            code: "{score}"
        },
        component: []
    };

    // Add components for each result
    Object.entries(data.results || {}).forEach(([key, value]) => {
        fhirResource.component.push({
            code: {
                coding: [{
                    system: "http://loinc.org",
                    code: key.toLowerCase(),
                    display: key
                }]
            },
            valueQuantity: {
                value: value,
                unit: "unit",
                system: "http://unitsofmeasure.org",
                code: "unit"
            }
        });
    });

    return fhirResource;
}

module.exports = {
    exportToHL7,
    exportToFHIR
};
