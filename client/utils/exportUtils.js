export const exportUtils = {
    toFHIR(data) {
        const timestamp = new Date().toISOString();
        return {
            resourceType: "Observation",
            status: "final",
            code: {
                coding: [{
                    system: "http://loinc.org",
                    code: "89545-0",
                    display: "SIRS Criteria Assessment"
                }]
            },
            effectiveDateTime: timestamp,
            valueBoolean: data.hasSIRS || data.sirsMet,
            component: Object.entries(data.criteriaDetails).map(([key, details]) => ({
                code: {
                    text: key
                },
                valueQuantity: {
                    value: details.value,
                    unit: details.criterion.split(' ')[1] || 'unit'
                }
            }))
        };
    },

    toHL7(data) {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, -5);
        const criteriaDetails = Object.entries(data.criteriaDetails)
            .map(([key, details]) => `${key}=${details.value}^${details.met ? 'met' : 'not met'}`)
            .join('~');
        
        return [
            'MSH|^~\\&|SIRSCALC|HOSPITAL|EHR|HOSPITAL|' + timestamp + '||ORU^R01|' + Math.random().toString(36).slice(2) + '|P|2.5.1',
            'PID|1||||||||',
            'OBR|1|||89545-0^SIRS Criteria Assessment^LN|||' + timestamp,
            'OBX|1|ST|89545-0^SIRS Assessment^LN||' + (data.hasSIRS || data.sirsMet ? 'SIRS Criteria Met' : 'SIRS Criteria Not Met') + '|||',
            'OBX|2|ST|89545-1^SIRS Details^LN||' + criteriaDetails + '|||'
        ].join('\r\n');
    },

    downloadFile(content, filename, type) {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
