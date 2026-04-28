export const calculatePriority = (task) => {
  if (!task.deadline) return 0;

  const now = new Date();
  const deadline = new Date(task.deadline);
  const diff = deadline - now;

  if (diff <= 0) return 1000;

  const hours = diff / (1000 * 60 * 60);

  return Math.max(1, Math.floor(100 / hours));
};