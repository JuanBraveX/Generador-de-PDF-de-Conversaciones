import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import USERID_FIELD from '@salesforce/schema/MessagingSession.MessagingEndUserId';
import NAME_FIELD from '@salesforce/schema/MessagingSession.Name';

import { loadScript } from 'lightning/platformResourceLoader';
import JSPDF from '@salesforce/resourceUrl/jspdf';
import getMessageHistory from '@salesforce/apex/MessagingSessionPdf.getMessageHistory';

const fields = [USERID_FIELD, NAME_FIELD];

export default class ExportChat extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields })
    messagingsession;

    messagesList = [];

    renderedCallback() {
        console.log('renderedCallback');
        loadScript(this, JSPDF)
            .then(() => {
                console.log('JSPDF library loaded successfully');
            })
            .catch(error => {
                console.error('Error loading JSPDF library:', error);
            });
        /*Promise.all([
            loadScript(this, JSPDF)
        ]);*/
    }

    get userId() {
        return getFieldValue(this.messagingsession.data, USERID_FIELD);
    }

    get name() {
        return getFieldValue(this.messagingsession.data, NAME_FIELD);
    }

    generatePdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
          
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(this.name, 100, 20, { align: "center" });
      
        let posY = 36;
        let currentPage = 1; //iniciador de pagina PDF
      
        this.messagesList.forEach(item => {
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          
          // Divide la cadena en múltiples líneas si es necesario
          const actorInfoLines = doc.splitTextToSize(
            item.ActorType + " • " + item.ActorName + " • " + item.EntryTime,
            175
          );
          
          // Agrega las líneas de información del actor
          doc.text(actorInfoLines, 15, posY);
          
          // Incrementa la posición Y en función de la altura de las líneas de información del actor
          posY += doc.getTextDimensions(actorInfoLines).h;
          doc.text(' ', 15, posY);
          posY += doc.getTextDimensions(actorInfoLines).h;
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
      
          // Divide el mensaje en múltiples líneas si es necesario
          const messageLines = doc.splitTextToSize(item.Message, 172);
          

          // Agrega las líneas del mensaje
          doc.text(messageLines, 15, posY);
      
          // Incrementa la posición Y en función de la altura de las líneas del mensaje
          posY += doc.getTextDimensions(messageLines).h + 6; // Agrega un espacio entre los mensajes

          // Si la posición Y excede el límite de la página, agrega una nueva página
          if (posY > 228) {
          doc.addPage(); // Agrega una nueva página
          posY = 32; // Reinicia la posición Y en la nueva página
          currentPage++; // Incrementa el número de página
          }

          // numerar páginas generadas
          for (let i = 1; i <= currentPage; i++) {
              doc.setPage(i);
            doc.text(`Página ${i}`, 175, 16);
            }

        });
      
        console.log('generatePdf');
        doc.save(this.name + ".pdf");
      };

    generateData() {
        console.log('generateData');
        getMessageHistory({endUserId: this.userId}).then(result => {
            console.log('getMessageHistory');
            this.messagesList = result;
            this.generatePdf();
        });
    }
}