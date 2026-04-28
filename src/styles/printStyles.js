export const printStyle = `
  @page {
    size: A4;
    margin: 14mm 8mm 2mm 8mm;
  }

  @media print {
    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      overflow: visible !important;
      width: auto !important;
      height: auto !important;
    }

    body * {
      visibility: hidden !important;
    }

    .packing-slip-overlay,
    .packing-slip-overlay * {
      visibility: visible !important;
    }

    .packing-slip-actions {
      display: none !important;
    }

    .packing-slip-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      background: white !important;
      padding: 0 !important;
      margin: 0 !important;
      display: block !important;
      z-index: 999999 !important;
    }

    .packing-slip {
      position: static !important;
      width: 100% !important;
      max-width: none !important;
      max-height: none !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: white !important;
    }

    #packing-slip-print-area {
      position: static !important;
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 12mm 2mm 12mm !important;
      overflow: visible !important;
      box-sizing: border-box !important;
    }

    .packing-slip-top-section {
      display: block !important;
      width: 100% !important;
      overflow: visible !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      margin: 0 0 18px 0 !important;
    }

    .packing-slip-print-header {
      display: block !important;
      width: 100% !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      margin: 0 0 18px 0 !important;
    }

    .packing-slip-addresses {
      display: table !important;
      width: 100% !important;
      table-layout: fixed !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      margin: 0 0 18px 0 !important;
    }

    .packing-slip-addresses > div {
      display: table-cell !important;
      width: 50% !important;
      vertical-align: top !important;
    }

    .packing-slip-message {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .packing-slip-table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
    }

    .packing-slip-table thead {
      display: table-header-group !important;
    }

    .packing-slip-table tr {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .packing-slip-table td,
    .packing-slip-table th {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .packing-slip-footer {
      position: fixed !important;
      left: 12mm !important;
      right: 12mm !important;
      bottom: 2mm !important;
      background: white !important;
      padding-top: 10px !important;
      border-top: 2px solid #1f2a44 !important;
      z-index: 999999 !important;
    }
  }
`;