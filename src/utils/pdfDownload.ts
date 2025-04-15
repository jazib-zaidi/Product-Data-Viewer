import html2pdf from 'html2pdf.js';

export const handleDownload = (contentRef, setLoading, domain) => {
  if (contentRef?.current) {
    setLoading(true);

    html2pdf()
      .set({
        margin: 10,
        filename: `${domain}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(contentRef.current)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        pdf.save(`${domain}.pdf`);
      })
      .finally(() => setLoading(false));
  }
};
