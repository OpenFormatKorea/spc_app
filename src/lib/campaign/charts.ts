export const generateLabels = (start_date: Date, end_date: Date) => {
  const labels = [];
  while (end_date >= start_date) {
    labels.push(
      end_date.toLocaleDateString("en-US", {
        // year: 'numeric',
        month: "2-digit",
        day: "2-digit",
      }),
    );
    end_date.setDate(end_date.getDate() - 1);
  }

  return labels.reverse();
};

export const addNumbers = (a: number, b: number): number => {
  return a + b;
};
