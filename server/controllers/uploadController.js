exports.upload = async(req,res) =>{
    if (!req.files || !req.files.pdf)
        return res.status(400).json({ error: "No file uploaded." });
    
      try {
        const pdfData = await pdfParse(req.files.pdf);
        res.json({ text: pdfData.text });
      } catch (error) {
        res.status(500).json({ error: "Error processing PDF" });
      }
}