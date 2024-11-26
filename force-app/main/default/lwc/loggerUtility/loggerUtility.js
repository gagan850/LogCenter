import logMessage from '@salesforce/apex/Logger.logMessage'; // Import Apex method

// General function to log a message
async function log(logLevel, feature, componentName, message) {
    try {
        await logMessage({ logLevel, feature, componentName, message }); 
        console.log(`Log [${logLevel}] sent to backend: ${logMessage}`);
    } catch (error) {
        console.error(`Error logging ${logLevel}:`, error);
    }
}

// Specific log level functions
export function fine(feature, componentName, message) {
    log('FINE', feature, componentName, message);
}

export function info(feature, componentName, message) {
    log('INFO', feature, componentName, message);
}

export function debug(feature, componentName, message) {
    log('DEBUG', feature, componentName, message);
}

export function warn(feature, componentName, message) {
    log('WARN', feature, componentName, message);
}

export function error(feature, componentName, message) {
    log('ERROR', feature, componentName, message);
}