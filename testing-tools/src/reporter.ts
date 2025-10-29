import chalk from 'chalk';
import { TestReport } from './types';

/**
 * 格式化測試報告
 */
export class ReportFormatter {
  /**
   * 打印控制台報告
   */
  static printConsoleReport(report: TestReport): void {
    console.log('\n' + '='.repeat(80));
    console.log(chalk.bold.cyan(`📊 測試報告: ${report.projectName}`));
    console.log('='.repeat(80));

    // 打印每個套件的結果
    report.suiteResults.forEach((suite) => {
      console.log(
        `\n${chalk.bold(suite.name)}: ${this.getStatusIcon(suite.passed, suite.failed)}`
      );
      console.log(
        `  總計: ${suite.total} | ` +
          chalk.green(`通過: ${suite.passed}`) +
          ` | ` +
          chalk.red(`失敗: ${suite.failed}`) +
          ` | ` +
          chalk.yellow(`跳過: ${suite.skipped}`) +
          ` | ` +
          chalk.gray(`耗時: ${suite.duration}ms`)
      );

      // 打印失敗的測試詳情
      const failedTests = suite.results.filter((r) => !r.passed && r.error !== 'Skipped');
      if (failedTests.length > 0) {
        console.log(chalk.red('\n  失敗的測試:'));
        failedTests.forEach((test) => {
          console.log(chalk.red(`    ❌ ${test.name}`));
          console.log(chalk.gray(`       ${test.error}`));
          if (test.response) {
            console.log(
              chalk.gray(`       狀態碼: ${test.response.status}`)
            );
            if (test.response.data) {
              console.log(
                chalk.gray(
                  `       響應: ${JSON.stringify(test.response.data).substring(0, 100)}...`
                )
              );
            }
          }
        });
      }
    });

    // 打印總結
    console.log('\n' + '='.repeat(80));
    console.log(chalk.bold('📈 總結統計'));
    console.log('='.repeat(80));

    const { summary } = report;
    console.log(
      `總測試數: ${summary.totalTests} | ` +
        chalk.green(`通過: ${summary.passedTests}`) +
        ` | ` +
        chalk.red(`失敗: ${summary.failedTests}`) +
        ` | ` +
        chalk.yellow(`跳過: ${summary.skippedTests}`)
    );
    console.log(
      `成功率: ${this.getSuccessRateColor(summary.successRate)}` +
        ` | 總耗時: ${chalk.gray(summary.totalDuration + 'ms')}`
    );

    const duration = report.endTime.getTime() - report.startTime.getTime();
    console.log(`執行時間: ${chalk.gray(this.formatDuration(duration))}`);
    console.log('='.repeat(80) + '\n');

    // 打印最終狀態
    if (summary.failedTests === 0) {
      console.log(chalk.bold.green('✅ 所有測試通過！\n'));
    } else {
      console.log(chalk.bold.red(`❌ ${summary.failedTests} 個測試失敗\n`));
    }
  }

  /**
   * 生成 JSON 報告
   */
  static generateJsonReport(report: TestReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * 生成 Markdown 報告
   */
  static generateMarkdownReport(report: TestReport): string {
    let md = `# 測試報告: ${report.projectName}\n\n`;
    md += `**測試時間**: ${report.startTime.toLocaleString()}\n\n`;

    // 總結
    md += `## 📈 總結\n\n`;
    md += `| 指標 | 數值 |\n`;
    md += `|------|------|\n`;
    md += `| 總測試數 | ${report.summary.totalTests} |\n`;
    md += `| ✅ 通過 | ${report.summary.passedTests} |\n`;
    md += `| ❌ 失敗 | ${report.summary.failedTests} |\n`;
    md += `| ⏭️ 跳過 | ${report.summary.skippedTests} |\n`;
    md += `| 成功率 | ${report.summary.successRate.toFixed(2)}% |\n`;
    md += `| 總耗時 | ${report.summary.totalDuration}ms |\n\n`;

    // 各套件詳情
    md += `## 📦 測試套件詳情\n\n`;
    report.suiteResults.forEach((suite) => {
      const icon = suite.failed === 0 ? '✅' : '❌';
      md += `### ${icon} ${suite.name}\n\n`;
      md += `- **總計**: ${suite.total}\n`;
      md += `- **通過**: ${suite.passed}\n`;
      md += `- **失敗**: ${suite.failed}\n`;
      md += `- **跳過**: ${suite.skipped}\n`;
      md += `- **耗時**: ${suite.duration}ms\n\n`;

      // 測試用例列表
      if (suite.results.length > 0) {
        md += `#### 測試用例\n\n`;
        suite.results.forEach((test) => {
          const status = test.passed
            ? '✅'
            : test.error === 'Skipped'
            ? '⏭️'
            : '❌';
          md += `- ${status} **${test.name}** (${test.duration}ms)\n`;
          if (test.error && test.error !== 'Skipped') {
            md += `  - ❌ 錯誤: ${test.error}\n`;
          }
        });
        md += '\n';
      }
    });

    return md;
  }

  /**
   * 生成 HTML 報告
   */
  static generateHtmlReport(report: TestReport): string {
    const successRate = report.summary.successRate;
    const statusColor = successRate === 100 ? '#4caf50' : successRate >= 80 ? '#ff9800' : '#f44336';

    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>測試報告 - ${report.projectName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background: ${statusColor}; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header .date { opacity: 0.9; font-size: 14px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; background: #f9f9f9; }
        .summary-item { text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .summary-item .value { font-size: 32px; font-weight: bold; color: #333; margin: 10px 0; }
        .summary-item .label { color: #666; font-size: 14px; text-transform: uppercase; }
        .suite { padding: 30px; border-bottom: 1px solid #e0e0e0; }
        .suite:last-child { border-bottom: none; }
        .suite-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .suite-title { font-size: 20px; font-weight: bold; color: #333; }
        .suite-stats { display: flex; gap: 15px; font-size: 14px; }
        .suite-stats span { padding: 4px 8px; border-radius: 4px; }
        .passed { background: #e8f5e9; color: #2e7d32; }
        .failed { background: #ffebee; color: #c62828; }
        .skipped { background: #fff3e0; color: #f57c00; }
        .test-list { list-style: none; }
        .test-item { padding: 12px; margin-bottom: 8px; border-radius: 4px; background: #f9f9f9; display: flex; justify-content: space-between; align-items: center; }
        .test-item.passed { border-left: 4px solid #4caf50; }
        .test-item.failed { border-left: 4px solid #f44336; }
        .test-item.skipped { border-left: 4px solid #ff9800; }
        .test-name { font-weight: 500; }
        .test-duration { color: #999; font-size: 12px; }
        .test-error { color: #c62828; font-size: 13px; margin-top: 8px; padding: 8px; background: #ffebee; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 測試報告: ${report.projectName}</h1>
            <div class="date">測試時間: ${report.startTime.toLocaleString()}</div>
        </div>
        
        <div class="summary">
            <div class="summary-item">
                <div class="label">總測試數</div>
                <div class="value">${report.summary.totalTests}</div>
            </div>
            <div class="summary-item">
                <div class="label">✅ 通過</div>
                <div class="value" style="color: #4caf50;">${report.summary.passedTests}</div>
            </div>
            <div class="summary-item">
                <div class="label">❌ 失敗</div>
                <div class="value" style="color: #f44336;">${report.summary.failedTests}</div>
            </div>
            <div class="summary-item">
                <div class="label">⏭️ 跳過</div>
                <div class="value" style="color: #ff9800;">${report.summary.skippedTests}</div>
            </div>
            <div class="summary-item">
                <div class="label">成功率</div>
                <div class="value" style="color: ${statusColor};">${successRate.toFixed(1)}%</div>
            </div>
            <div class="summary-item">
                <div class="label">總耗時</div>
                <div class="value" style="color: #666;">${report.summary.totalDuration}ms</div>
            </div>
        </div>

        ${report.suiteResults
          .map(
            (suite) => `
            <div class="suite">
                <div class="suite-header">
                    <h2 class="suite-title">${suite.failed === 0 ? '✅' : '❌'} ${suite.name}</h2>
                    <div class="suite-stats">
                        <span class="passed">通過: ${suite.passed}</span>
                        <span class="failed">失敗: ${suite.failed}</span>
                        <span class="skipped">跳過: ${suite.skipped}</span>
                    </div>
                </div>
                <ul class="test-list">
                    ${suite.results
                      .map((test) => {
                        const status = test.passed
                          ? 'passed'
                          : test.error === 'Skipped'
                          ? 'skipped'
                          : 'failed';
                        const icon = test.passed ? '✅' : test.error === 'Skipped' ? '⏭️' : '❌';
                        return `
                        <li class="test-item ${status}">
                            <div>
                                <div class="test-name">${icon} ${test.name}</div>
                                ${
                                  test.error && test.error !== 'Skipped'
                                    ? `<div class="test-error">❌ ${test.error}</div>`
                                    : ''
                                }
                            </div>
                            <div class="test-duration">${test.duration}ms</div>
                        </li>
                        `;
                      })
                      .join('')}
                </ul>
            </div>
            `
          )
          .join('')}
    </div>
</body>
</html>
    `;
  }

  /**
   * 獲取狀態圖標
   */
  private static getStatusIcon(passed: number, failed: number): string {
    if (failed === 0) {
      return chalk.green('✅');
    }
    return chalk.red('❌');
  }

  /**
   * 獲取成功率顏色
   */
  private static getSuccessRateColor(rate: number): string {
    const rateStr = `${rate.toFixed(2)}%`;
    if (rate === 100) {
      return chalk.green(rateStr);
    } else if (rate >= 80) {
      return chalk.yellow(rateStr);
    } else {
      return chalk.red(rateStr);
    }
  }

  /**
   * 格式化持續時間
   */
  private static formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  }
}
