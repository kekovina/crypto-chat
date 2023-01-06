import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
    res.redirect(301, `/pm/${uuidv4()}`)
  }