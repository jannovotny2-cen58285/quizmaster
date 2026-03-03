import type { Page } from '@playwright/test'

export class QuizStatsPage {
    constructor(private page: Page) {}

    public pageHeadingLocator = () => this.page.locator('h2')
    public firstTableLocator = () => this.page.locator('table').nth(0)
    public secondTableLocator = () => this.page.locator('table').nth(1)
    public attemptStatsTableLocator = () => this.page.getByTestId('attempt-stats-table')
    public summaryStatsTableLocator = () => this.page.getByTestId('summary-stats-table')
    public attemptStatsTableCaptionLocator = () => this.attemptStatsTableLocator().locator('caption')
    public summaryStatsTableCaptionLocator = () => this.summaryStatsTableLocator().locator('caption')
    public attemptStatsTableHeaderCellsLocator = () => this.attemptStatsTableLocator().locator('thead th')
    public summaryStatsTableHeaderCellsLocator = () => this.summaryStatsTableLocator().locator('thead th')
    public attemptStatsTableBodyRowsLocator = () => this.attemptStatsTableLocator().locator('tbody tr')
    public summaryStatsTableBodyRowsLocator = () => this.summaryStatsTableLocator().locator('tbody tr')
}
