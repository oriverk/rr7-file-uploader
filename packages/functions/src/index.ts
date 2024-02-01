import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { onRequest } from 'firebase-functions/v2/https';
import * as RSS from "rss"

initializeApp();
const db = getFirestore();

// exports.createRSSfeed = onDocumentCreated("files/{docId}", async (event) => {
//   console.log('RSS Feed generated and saved to Firestore');
// })

exports.healthCheck = onRequest(
  { region: "asia-northeast1" },
  (request, response) => {
  response.status(200).send('OK');
  }
);

exports.returnRSS = onRequest(
  { region: "asia-northeast1" },
  async (request, response) => {
    const querySnapshot = await db.collection("files").where("deletedAt", "==", null).get()

    const feed = new RSS({
      title: "uploader",
      feed_url: "https://uploader.ixanary.com/files/rss.xml",
      site_url: "https://uploader.ixanary.com"
    })

    querySnapshot.forEach(doc => {
      const { name, createdAt } = doc.data()
      const createdAtDate = createdAt.toDate();
      const createdAtString = createdAtDate.toISOString();

      feed.item({
        title: name,
        url: `https://uploader.ixanary.com/files/${doc.id}`,
        date: createdAtString,
        description: "更新しました。"
      })
    })

    const xml = feed.xml({
      indent: true
    })

    // 43200 = 60 * 60 * 12
    // response.set('Cache-Control', 'public, s-maxage=43200')
    response.set('Content-Type', 'application/xml; charset=utf-8');
    response.status(200).send(xml)
  }
)
