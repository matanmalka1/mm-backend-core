import { Router } from "express";

const router = Router();
const items = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: `item-${i + 1}`,
}));

router.get("/items", (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const q = (req.query.q || "").toString().toLowerCase();

  const filtered = items.filter((i) => i.name.includes(q));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.json({
    page,
    limit,
    total: filtered.length,
    data,
  });
});

export default router;
