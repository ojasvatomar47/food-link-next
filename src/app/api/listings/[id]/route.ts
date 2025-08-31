import { NextRequest } from "next/server";
import { updateListing, patchUpdateListing, deleteListing } from "@/controllers/listingController";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return updateListing(req, context);
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return patchUpdateListing(req, context);
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  return deleteListing(req, context);
}