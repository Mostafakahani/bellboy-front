"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { showError } from "@/lib/toastService";
import { Input } from "@/components/ui/Input/Input";
import DashboardButton from "@/components/ui/Button/DashboardButton";

interface ParentService {
  _id: string;
  name: string;
  isParent: boolean;
}

interface ChildService {
  _id: string;
  name: string;
  isParent: boolean;
  id_parent: string;
}

export default function ServicePage() {
  const authenticatedFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [isChildrenLoading, setIsChildrenLoading] = useState<{ [key: string]: boolean }>({});
  const [isUpdating, setIsUpdating] = useState<{ [key: string]: boolean }>({});

  const [parents, setParents] = useState<ParentService[]>([]);
  const [children, setChildren] = useState<{ [key: string]: ChildService[] }>({});
  const [newParentName, setNewParentName] = useState("");
  const [newChildName, setNewChildName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);

  useEffect(() => {
    fetchParents();
  }, []);

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const { data, error, message } = await authenticatedFetch("/service-option", {
        method: "GET",
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      setParents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching parents:", err);
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildren = async (parentId: string) => {
    setIsChildrenLoading((prev) => ({ ...prev, [parentId]: true }));
    try {
      const { data, error, message } = await authenticatedFetch(`/service-option/${parentId}`, {
        method: "GET",
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      setChildren((prev) => ({ ...prev, [parentId]: Array.isArray(data) ? data : [] }));
    } catch (err) {
      console.error("Error fetching children:", err);
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsChildrenLoading((prev) => ({ ...prev, [parentId]: false }));
    }
  };

  const addParent = async () => {
    if (!newParentName.trim()) return;
    setIsUpdating((prev) => ({ ...prev, addParent: true }));
    try {
      const { error, message } = await authenticatedFetch("/service-option", {
        method: "POST",
        body: JSON.stringify({ name: newParentName, isParent: true }),
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      setNewParentName("");
      fetchParents();
    } catch (err) {
      console.error("Error adding parent:", err);
      showError(err instanceof Error ? err.message : "خطا در افزودن سرویس");
    } finally {
      setIsUpdating((prev) => ({ ...prev, addParent: false }));
    }
  };

  const addChild = async (parentId: string) => {
    if (!newChildName.trim()) return;
    setIsUpdating((prev) => ({ ...prev, [parentId]: true }));
    try {
      const { error, message } = await authenticatedFetch(`/service-option/${parentId}`, {
        method: "POST",
        body: JSON.stringify({ name: newChildName }),
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      setNewChildName("");
      setAddingChildTo(null);
      fetchChildren(parentId);
    } catch (err) {
      console.error("Error adding child:", err);
      showError(err instanceof Error ? err.message : "خطا در افزودن زیرمجموعه");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [parentId]: false }));
    }
  };

  const updateItem = async (id: string) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      const { error, message } = await authenticatedFetch(`/service-option/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName }),
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      setEditingId(null);
      fetchParents();
      Object.keys(children).forEach(fetchChildren);
    } catch (err) {
      console.error("Error updating item:", err);
      showError(err instanceof Error ? err.message : "خطا در بروزرسانی");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const deleteItem = async (id: string, parentId?: string) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      const { error, message } = await authenticatedFetch(`/service-option/${id}`, {
        method: "DELETE",
      });
      if (error) {
        throw new Error(formatErrorMessage(message));
      }
      if (parentId) {
        fetchChildren(parentId);
      } else {
        fetchParents();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      showError(err instanceof Error ? err.message : "خطا در حذف آیتم");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="container mx-auto p-4">
          <div className="text-center">در حال بارگذاری...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">مدیریت سرویس‌ها</h1>

          {/* Add Parent Form */}
          <div className="flex flex-col gap-2 mb-6">
            <Input
              type="text"
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
              placeholder="نام سرویس جدید"
              dir="rtl"
              disabled={isUpdating["addParent"]}
            />
            <DashboardButton
              onXsIsText
              icon="plus"
              onClick={addParent}
              disabled={isUpdating["addParent"]}
            >
              {isUpdating["addParent"] ? "در حال افزودن..." : "افزودن سرویس"}
            </DashboardButton>
          </div>

          {/* Parents List */}
          <div className="space-y-4">
            {parents.map((parent) => (
              <div key={parent._id} className="border rounded-xl p-4">
                <div className="w-full flex flex-col justify-between gap-5">
                  {editingId === parent._id ? (
                    <div className="w-full flex flex-col gap-2">
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full"
                        disabled={isUpdating[parent._id]}
                      />
                      <div className="flex flex-row gap-5">
                        <button
                          onClick={() => updateItem(parent._id)}
                          className="text-green-500 disabled:opacity-50"
                          disabled={isUpdating[parent._id]}
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-500"
                          disabled={isUpdating[parent._id]}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-4 w-full">
                      <span className="font-bold text-md max-w-[13rem] line-clamp-1">
                        {parent.name}
                      </span>
                      <div className="flex gap-4">
                        <DashboardButton
                          onXsIsText
                          onClick={() => {
                            setEditingId(parent._id);
                            setEditName(parent.name);
                          }}
                          disabled={isUpdating[parent._id]}
                          variant="secondary"
                          className="text-green-500 border-green-500 disabled:opacity-50"
                        >
                          <Pencil size={20} />
                        </DashboardButton>
                        <button
                          onClick={() => deleteItem(parent._id)}
                          className="text-red-500 disabled:opacity-50"
                          disabled={isUpdating[parent._id]}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  <DashboardButton
                    onXsIsText
                    onClick={() => {
                      if (expandedParent === parent._id) {
                        setExpandedParent(null);
                      } else {
                        setExpandedParent(parent._id);
                        fetchChildren(parent._id);
                      }
                    }}
                    variant="secondary"
                    disabled={isChildrenLoading[parent._id]}
                  >
                    {isChildrenLoading[parent._id]
                      ? "در حال بارگذاری..."
                      : expandedParent === parent._id
                      ? "بستن"
                      : "مشاهده زیرمجموعه‌ها"}
                  </DashboardButton>
                </div>

                {/* Children Section */}
                {expandedParent === parent._id && (
                  <div className="mt-8">
                    {/* Add Child Form */}
                    {addingChildTo === parent._id ? (
                      <div className="flex flex-col gap-2 mb-8">
                        <Input
                          type="text"
                          value={newChildName}
                          onChange={(e) => setNewChildName(e.target.value)}
                          placeholder="نام زیرمجموعه جدید"
                          dir="rtl"
                          disabled={isUpdating[parent._id]}
                        />
                        <div className="flex flex-row gap-3">
                          <DashboardButton
                            onXsIsText
                            onClick={() => addChild(parent._id)}
                            disabled={isUpdating[parent._id]}
                          >
                            {isUpdating[parent._id] ? "در حال افزودن..." : "افزودن"}
                          </DashboardButton>
                          <DashboardButton
                            onXsIsText
                            onClick={() => setAddingChildTo(null)}
                            variant="tertiary"
                            className="!border-red-500 !border !text-red-500 disabled:opacity-50"
                            disabled={isUpdating[parent._id]}
                          >
                            انصراف
                          </DashboardButton>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-row justify-end">
                        <DashboardButton
                          onXsIsText
                          onClick={() => setAddingChildTo(parent._id)}
                          disabled={isUpdating[parent._id]}
                          icon="plus"
                          className="!p-0 !mb-4"
                          variant="tertiary"
                          iconClassname="!text-black"
                        >
                          افزودن زیرمجموعه
                        </DashboardButton>
                      </div>
                    )}

                    {/* Children List */}
                    <div className="space-y-2 px-3">
                      {children[parent._id]?.map((child) => (
                        <div
                          key={child._id}
                          className="flex justify-between items-center border-b py-4"
                        >
                          {editingId === child._id ? (
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                dir="rtl"
                                disabled={isUpdating[child._id]}
                              />
                              <DashboardButton
                                onXsIsText
                                onClick={() => updateItem(child._id)}
                                className="text-green-500 disabled:opacity-50"
                                disabled={isUpdating[child._id]}
                              >
                                <Save size={16} />
                              </DashboardButton>
                              <DashboardButton
                                onXsIsText
                                onClick={() => setEditingId(null)}
                                variant="secondary"
                                iconClassname="!text-red-500 disabled:opacity-50"
                                disabled={isUpdating[child._id]}
                              >
                                <X size={16} />
                              </DashboardButton>
                            </div>
                          ) : (
                            <>
                              <span className="max-w-[9rem] line-clamp-1">{child.name}</span>
                              <div className="flex gap-2">
                                <DashboardButton
                                  onXsIsText
                                  onClick={() => {
                                    setEditingId(child._id);
                                    setEditName(child.name);
                                  }}
                                  variant="secondary"
                                  className="text-green-500 border-green-500 disabled:opacity-50"
                                  disabled={isUpdating[child._id]}
                                >
                                  <Pencil size={20} />
                                </DashboardButton>
                                <DashboardButton
                                  onXsIsText
                                  onClick={() => deleteItem(child._id, parent._id)}
                                  variant="secondary"
                                  className="text-red-500 border-red-500 disabled:opacity-50"
                                  disabled={isUpdating[child._id]}
                                >
                                  <Trash2 size={20} />
                                </DashboardButton>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
