import { DATE_FORMAT_OPTIONS, getTimeAgo } from '../utils/dateUtils.js';
import { apiService } from '../services/apiService.js';

export class HistoryDisplay {
    constructor(container) {
        this.container = container;
        this.onHistoryChange = null;
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

    async handleDelete(id, itemElement) {
        try {
            itemElement.classList.add('deleting');
            await apiService.deleteCalculation(id);
            itemElement.remove();
            if (this.onHistoryChange) {
                this.onHistoryChange();
            }
        } catch (error) {
            console.error('Error deleting calculation:', error);
            itemElement.classList.remove('deleting');
            alert('Failed to delete calculation: ' + error.message);
        }
    }

    async handleClearAll() {
        if (!confirm('Are you sure you want to clear all calculations?')) {
            return;
        }

        try {
            this.container.classList.add('clearing');
            await apiService.clearHistory();
            this.container.innerHTML = '<div class="no-history">No calculations found</div>';
            if (this.onHistoryChange) {
                this.onHistoryChange();
            }
        } catch (error) {
            console.error('Error clearing history:', error);
            this.container.classList.remove('clearing');
            alert('Failed to clear history: ' + error.message);
        }
    }

    showHistory(history) {
        if (!history || history.length === 0) {
            this.container.innerHTML = '<div class="no-history">No calculations found</div>';
            return;
        }

        const clearAllButton = `
            <div class="history-controls">
                <button class="clear-all-button" onclick="this.closest('.history-list').historyDisplay.handleClearAll()">
                    Clear All Calculations
                </button>
            </div>
        `;

        const historyHtml = history.map(item => {
            const timeAgo = getTimeAgo(item.createdAt);
            const formattedDate = item.createdAt.toLocaleString('en-US', DATE_FORMAT_OPTIONS);

            return `
                <div class="history-item ${item.sirsMet ? 'criteria-met' : 'criteria-not-met'}" data-id="${item.id}">
                    <div class="history-header">
                        <span class="criteria-count">Criteria Met: ${item.criteriaCount}/4</span>
                        <span class="date" title="${formattedDate}">${timeAgo}</span>
                        <button class="delete-button" onclick="this.closest('.history-item').closest('.history-list').historyDisplay.handleDelete('${item.id}', this.closest('.history-item'))">
                            ✕
                        </button>
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

        this.container.innerHTML = clearAllButton + historyHtml;
        this.container.historyDisplay = this;
    }
}
