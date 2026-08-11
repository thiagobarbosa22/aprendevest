export const userRoles = [
  "student",
  "teacher",
  "author",
  "reviewer",
  "editor",
  "support",
  "admin",
] as const;

export type UserRole = (typeof userRoles)[number];

export const permissions = [
  "profile:read:self",
  "profile:update:self",
  "content:create",
  "content:review",
  "content:publish",
  "content:unpublish",
  "content:delete",
  "students:read:assigned",
  "users:support",
  "users:manage",
  "audit:read",
] as const;

export type Permission = (typeof permissions)[number];

const basePermissions: Permission[] = [
  "profile:read:self",
  "profile:update:self",
];

const permissionsByRole: Record<UserRole, readonly Permission[]> = {
  student: basePermissions,
  teacher: [...basePermissions, "students:read:assigned"],
  author: [...basePermissions, "content:create"],
  reviewer: [...basePermissions, "content:review"],
  editor: [
    ...basePermissions,
    "content:create",
    "content:review",
    "content:publish",
    "content:unpublish",
  ],
  support: [...basePermissions, "users:support"],
  admin: permissions,
};

export function can(role: UserRole, permission: Permission): boolean {
  return permissionsByRole[role].includes(permission);
}
