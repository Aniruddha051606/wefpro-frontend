import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("wefpro_db"); 

        if (req.method === 'GET') {
            const orders = await db.collection("orders").find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(orders);
        } 
        
        if (req.method === 'POST') {
            const result = await db.collection("orders").insertOne(req.body);
            return res.status(201).json(result);
        }
    } catch (e) {
        return res.status(500).json({ error: "Cloud Connection Failed" });
    }
}