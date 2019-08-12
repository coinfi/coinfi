module HealthcheckHelpers
  def log_or_ping_on_missing_data(missing_data, healthcheck_url = nil)
    if missing_data.blank?
      Net::HTTP.get(URI.parse(healthcheck_url)) unless healthcheck_url.blank?
    else
      healthcheck_or_log_error(missing_data, healthcheck_url)
    end
  end

  def healthcheck_or_log_error(error, healthcheck_url = nil)
    if healthcheck_url.present?
      Net::HTTP.post(URI.parse("#{healthcheck_url}/fail"), error.try(:to_json))
    else
      if error.is_a?(Hash)
        puts "Failure with error as Hash:"
        error.each do |k, v|
          puts "[#{k}] #{v}"
        end
      elsif error.is_a?(Array)
        puts "Failure with error as Array:"
        error.each do |v|
          puts "#{v}"
        end
      else
        puts error
      end
    end
  end
end