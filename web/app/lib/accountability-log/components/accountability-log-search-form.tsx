import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { FaSearchengin } from "react-icons/fa6";
import { AnimatedAlert } from "~/components/animated-alert";
import { useAccountabilityLogSearchForm } from "../hooks/use-accountability-log-search-form";
import * as validation from "../validation/find-all.schema";

export function AccountabilityLogSearchForm() {
  const { form, handleChange, handleSubmit } = useAccountabilityLogSearchForm();

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {form.generalError !== null && (
          <AnimatedAlert color="danger" title="Erro ao pesquisar logs">
            {form.generalError}
          </AnimatedAlert>
        )}
      </AnimatePresence>

      <Form
        method="get"
        onSubmit={handleSubmit}
        validationErrors={form.formErrors}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Input
          name="search"
          label="Busca"
          placeholder="Busca..."
          defaultValue={validation.defaultObject.search}
          onChange={handleChange}
          startContent={<FaSearchengin className="text-default-400" />}
        />
        <Select
          name="who"
          label="Quem"
          placeholder="Selecione quem"
          defaultSelectedKeys={[validation.defaultObject.who ?? "all"]}
          onChange={handleChange}
        >
          <SelectItem key="all" textValue="all">
            Todos
          </SelectItem>
          <SelectItem key="system" textValue="system">
            Sistema
          </SelectItem>
        </Select>
        <Input
          name="after"
          label="Depois"
          type="date"
          defaultValue={validation.defaultObject.after}
          onChange={handleChange}
        />
        <Input
          name="before"
          label="Antes"
          type="date"
          defaultValue={validation.defaultObject.before}
          onChange={handleChange}
        />
        <Button color="primary" type="submit" className="mt-4">
          Buscar
        </Button>
      </Form>
    </div>
  );
}
