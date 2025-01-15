import { DATE_FORMAT_OPTIONS, getTimeAgo } from '../utils/dateUtils.js';

export class HistoryDisplay {
    constructor(container) {
        this.container = container;
    }

    showLoading() {
        this.container.innerHTML = '<div class="loading">Loading history...</div>';
    }

    showError(error, onRetry) {
        this.container.innerHTML = `
            <div class="error">
                Error loading history: ${error.message}
                <button class="retry-button">Retry</button>
            </div>
        `;
        this.container.querySelector('.retry-button').onclick = onRetry;
    }

    showHistory(history) {
        if (!history || history.length === 0) {
            this.container.innerHTML = '<div class="no-history">No calculations found</div>';
            return;
        }

        const historyHtml = history.map(item => {
            const timeAgo = getTimeAgo(item.createdAt);
            const formattedDate = item.createdAt.toLocaleString('en-US', DATE_FORMAT_OPTIONS);
            
            return `
                <div class="history-item ${item.sirsMet ? 'criteria-met' : 'criteria-not-met'}">
                    <div class="history-header">
                        <span class="criteria-count">Criteria Met: ${item.criteriaCount}/4</span>
                        <span class="date" title="${formattedDate}">${timeAgo}</span>
                    </div>
                    <div class="history-details">
                        <div>Temperature: ${item.temperature}°C</div>
                        <div>Heart Rate: ${item.heartRate} bpm</div>
                        <div>Respiratory Rate: ${item.respiratoryRate} /min</div>
                        <div>WBC: ${item.wbc} /mm³</div>
                    </div>
                </div>
            `;
        }).join('');

        this.container.innerHTML = historyHtml;
    }
}
