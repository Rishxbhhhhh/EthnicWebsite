router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }

  try {
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "Role updated successfully.", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role." });
  }
});
