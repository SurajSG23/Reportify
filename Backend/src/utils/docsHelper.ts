import fs from "fs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, Table, TableRow, TableCell, AlignmentType, Footer, PageBorderZOrder, PageBorderDisplay, BorderStyle, PageNumber } from "docx";
import { generateCompleteMDXContent } from "./reportMdxGenerator";
import { submissionDetails, professorDetails } from "../data/sampleData";
import { getIndentationLevel, parseTextWithBold } from "./docxUtils";
import { professorDetailsType, submissionDetailsType } from "../config/types";
import { Response } from "express";
async function createDocument(topic: string, res : Response, submissionDetails: submissionDetailsType[], professorDetails: professorDetailsType) {
    const mdText = await generateCompleteMDXContent(topic);
    if (!mdText) {
      console.error("Failed to generate MDX content.");
      return;
    }
    console.log("Generated content")
    const lines = mdText.split("\n").filter((line) => line.trim() !== "");
    const initialContent = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({ 
            text: "JSS MAHAVIDYAPEETHA", 
            bold: true, 
            size: 32, 
            font: "Times New Roman", 
            color: "000000" 
          })
        ],
        alignment: "center",
        spacing: { line: 360 }
      }),
      new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({ 
              text: "JSS Science and Technology University", 
              bold: true, 
              size: 32, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: { line: 360 }
        }),
        new Paragraph({
          children: [
              new ImageRun({
                  type: "jpg",
                  data: fs.readFileSync("./src/data/Picture1.jpg"),
                  transformation: {
                      width: 220,
                      height: 100,
                  },
                  altText: {
                      title: "This is an ultimate title",
                      description: "This is an ultimate image",
                      name: "My Ultimate Image",
                  },
              }),
              
          ],
          alignment: "center",
      }),
      new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({ 
              text:  `"${topic}"`, 
              bold: true, 
              size: 28, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: { before: 300, line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  "Event 1", 
              bold: true, 
              size: 28, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: { line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `Subject: ${professorDetails.subject}`, 
              bold: true, 
              size: 26, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: {before:300, line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `Subject Code: ${professorDetails.subjectCode}`, 
              bold: true, 
              size: 26, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: {line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  "Submitted by ", 
              bold: true, 
              italics: true,
              size: 26, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: {before: 300,line: 360 }
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Roll Number", bold: true, size: 26, font: "Times New Roman", color: "000000" })
                      ],
                      alignment: "center",
                      spacing: {line: 360 }
                    })
                  ],
                  width: { size: 5000, type: "auto" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "USN", bold: true, size: 26, font: "Times New Roman", color: "000000" })
                      ],
                      alignment: "center",
                      spacing: {line: 360 }
                    })
                  ],
                  width: { size: 5000, type: "auto" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Name", bold: true, size: 26, font: "Times New Roman", color: "000000" })
                      ],
                      alignment: "center",
                      spacing: {line: 360 }
                    })
                  ],
                  width: { size: 5000, type: "auto" },
                })
              ],
            }),
            ...submissionDetails.map((detail) => new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: detail.rollNumber, size: 26, font: "Times New Roman", color: "000000" })
                      ],
                      alignment: "center",
                      spacing: {line: 360 }
                    })
                  ],
                  width: { size: 5000, type: "auto" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: detail.USN, size: 26, font: "Times New Roman", color: "000000" })
                      ],
                      alignment: "center",
                      spacing: {line: 360 }
                    })
                  ],
                  width: { size: 5000, type: "auto" },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: detail.name, size: 26, font: "Times New Roman", color: "000000" })
                      ],
                      alignment: "center",
                      spacing: {line: 360 }
                    })
                  ],
                  width: { size: 5000, type: "auto" },
                })
              ],
            }))
          ],
          alignment: "center",
        }),
  
        new Paragraph({
          children: [
            new TextRun({ 
              text:  "Under the guidance of ", 
              bold: true, 
              size: 26, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: {before: 300,line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `${professorDetails.name}`, 
              bold: true, 
              size: 26, 
              font: "Times New Roman", 
              color: "000000"
            })
          ],
          alignment: "center",
          spacing: {before: 300,line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `${professorDetails.designation}`, 
              size: 24, 
              font: "Times New Roman", 
              color: "000000"
            })
          ],
          alignment: "center",
          spacing: {line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `Dept of ${professorDetails.department}`, 
              size: 24, 
              font: "Times New Roman", 
              color: "000000"
            })
          ],
          alignment: "center",
          spacing: {line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `${professorDetails.college}`, 
              size: 24, 
              font: "Times New Roman", 
              color: "000000"
            })
          ],
          alignment: "center",
          spacing: {line: 360 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text:  `Department of ${professorDetails.department} (2024-2025)`, 
              bold: true, 
              size: 32, 
              font: "Times New Roman", 
              color: "000000" 
            })
          ],
          alignment: "center",
          spacing: {line: 360 }
        }),
        new Paragraph({
          pageBreakBefore: true,
        }),
                
  ]
        
    
    
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              borders: {
                pageBorderBottom: { style: BorderStyle.THIN_THICK_MEDIUM_GAP, size: 4 * 8, color: "000000", space: 30 },
                pageBorderLeft: { style: BorderStyle.THIN_THICK_MEDIUM_GAP, size: 4 * 8, color: "000000", space: 30 },
                pageBorderRight: { style: BorderStyle.THIN_THICK_MEDIUM_GAP, size: 4 * 8, color: "000000", space: 30 },
                pageBorderTop: { style: BorderStyle.THIN_THICK_MEDIUM_GAP, size: 4 * 8, color: "000000", space: 30 },
                pageBorders: { display: PageBorderDisplay.NOT_FIRST_PAGE, offsetFrom: "page", zOrder: PageBorderZOrder.FRONT },
              },
              margin: {
                  footer: "0.2cm"
              }
              
            },
          },
          footers: {
              first: new Footer({
                 children: [
                     
                 ] 
              }),
              default: new Footer({
                  children: [
                      new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                              new TextRun({
                                  children: ["Page Number: ", PageNumber.CURRENT],
                                  
                              }),
                              new TextRun({
                                  children: [" of ", PageNumber.TOTAL_PAGES],
                              }),
                          ],
                      }),
  
                  ],
                  
                  
              }),
          },
          
          children: [
              ...initialContent,
              ...lines.map((line) => {
                if (line.startsWith("# ")) {
                  return new Paragraph({
                    heading: HeadingLevel.TITLE,
                    children: [
                      new TextRun({ 
                        text: line.replace("# ", ""), 
                        bold: true, 
                        size: 48, 
                        font: "Times New Roman", 
                        color: "000000" 
                      })
                    ],
                    alignment: "center",
                    spacing: { line: 360 }
                  });
                } else if (line.startsWith("## ")) {
                  // Heading 1 (H2)
                  return new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [
                      new TextRun({ 
                        text: line.replace("## ", ""), 
                        bold: true, 
                        size: 32, 
                        font: "Times New Roman", 
                        color: "000000" 
                      })
                    ],
                    spacing: { line: 360 }
                  });
                } else if (line.startsWith("### ")) {
                  // Heading 2 (H3)
                  return new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    children: [
                      new TextRun({ 
                        text: line.replace("### ", ""), 
                        bold: true, 
                        size: 24, 
                        font: "Times New Roman", 
                        color: "000000" 
                      })
                    ],
                    spacing: { line: 360 }
                  });
                } else if (line.startsWith("#### ")) {
                  // Heading 3 (H4)
                  return new Paragraph({
                    heading: HeadingLevel.HEADING_3,
                    children: [
                      new TextRun({ 
                        text: line.replace("#### ", ""), 
                        bold: true, 
                        size: 18, 
                        font: "Times New Roman", 
                        color: "000000" 
                      })
                    ],
                    spacing: { line: 360 }
                  });
                } else if (line.trim().startsWith("- ")) {
                  // Bullet point
                  return new Paragraph({
                    children: parseTextWithBold(line.replace(/^\s*-\s*/, "")),
                    bullet: { level: getIndentationLevel(line) },
                    spacing: { line: 360 }
                  });
                } else if (line.trim().startsWith("---")) {
                  // Page break
                  return new Paragraph({
                    pageBreakBefore: true
                  });
                } else {
                  // Regular paragraph
                  return new Paragraph({
                    children: parseTextWithBold(line),
                    spacing: { line: 360 }
                  });
                }
              }),
            ],
          },
        ],
      });
      console.log("Doc written")
    const buffer = await Packer.toBuffer(doc)
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=generated.docx",
    });
    res.end(buffer);    
    // fs.writeFileSync(`Document.docx`, buffer);
    console.log(`DOCX file for "${topic}" created successfully!`);
    return buffer;
  }

export { createDocument }