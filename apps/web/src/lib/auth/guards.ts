import type { Permission, UserRole } from "@aprendevest/domain";
import { can } from "@aprendevest/domain";
import { redirect } from "next/navigation";

import { getCurrentUser } from "./session";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!can(user.role as UserRole, permission))
    redirect("/app?erro=sem-permissao");
  return user;
}
