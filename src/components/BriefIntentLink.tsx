"use client";

import Link from "next/link";
import type {
  ComponentProps,
  ReactNode,
} from "react";
import {
  writeBriefIntent,
} from "@/lib/brief-intent";

type BriefIntentLinkProps =
  Omit<
    ComponentProps<typeof Link>,
    "children"
  > & {
    children: ReactNode;
    need?: string;
    engagement?: string;
  };

export function BriefIntentLink({
  children,
  need,
  engagement,
  onClick,
  ...props
}: BriefIntentLinkProps) {
  return (
    <Link
      {...props}
      onClick={(
        event,
      ) => {
        writeBriefIntent({
          ...(need
            ? { need }
            : {}),
          ...(engagement
            ? {
                engagement,
              }
            : {}),
        });

        onClick?.(
          event,
        );
      }}
    >
      {children}
    </Link>
  );
}
