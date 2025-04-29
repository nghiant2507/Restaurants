export async function GetRestaurant(
  request: Request,
  { params }: { params: Promise<{ id: number }> },
) {
  const { id } = await params;
  return new Response(id.toString());
}
